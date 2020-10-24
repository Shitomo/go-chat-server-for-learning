package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"net/http"
	"time"
)

var rooms = make(map[string]*ConnHub)

func roomManager(roomName string) *ConnHub {
	if roomHub, ok := rooms[roomName]; !ok {
		rooms[roomName] = newConnHub()
		//TODO goroutine leek risk 部屋の上限数の設定と，部屋を監視しクライアントが0人になった部屋のgoroutineをdoneする機能
		go rooms[roomName].run()
		return rooms[roomName]
	} else {
		return roomHub
	}
}

const(
	writeWait = 10 * time.Second
	pongWait = 60 * time.Second
	pingPeriod = (pongWait * 9) /10
	maxMessageSize = 512
)

var upgrader = websocket.Upgrader{
	ReadBufferSize :1024,
	WriteBufferSize: 1024,
	//チェックオリジンにはリクエスト元のアドレスをチェックする関数をセットする．
	//今回の場合は常にtrueを返す関数をセットしている=アドレスからのリクエストも許容する
	CheckOrigin: func(r *http.Request) bool {return true},
}

type JsonData struct {
	Name string `json:"name"`
	Text string `json:"text"`
	Time string `json:"timestamp"`
}

type Client struct {
	name string
	roomName string
	hub *ConnHub
	conn *websocket.Conn
	send chan []byte //バイト型の配列
}

func (c *Client) readPump() {
	defer func() {
		c.hub.unregister <- c
		c.conn.Close()
	}()

	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error {
		c.conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})
	for {
		fmt.Println("reading from client")

		message := JsonData{}
		if err := c.conn.ReadJSON(&message); err != nil {
			fmt.Println("Error reading JSON", err)
			return
		}
		fmt.Printf("Get response: %#v\n", message)

		messageJson, _ := json.Marshal(message)
		c.hub.broadcast <- messageJson
	}
}

func (c *Client) writePump() {
	//一定周期ごとに何かをする処理に使う
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				return
			}
			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)
			n := len(c.send)
			for i := 0; i < n; i++ {
				var msg = <-c.send
				w.Write(msg)
			}
			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, []byte{}); err != nil {
				return
			}
		}
	}
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, "Could not open websocket connection", http.StatusBadRequest)
	}

	userName := r.URL.Query().Get("name")
	roomName := r.URL.Query().Get("roomName")
	roomHub := roomManager(roomName)
	client := &Client {
		name: userName,
		roomName: roomName,
		hub: roomHub,
		conn: conn,
		send: make(chan []byte, 256), //同じ人に対して256個のメッセージまでキューイングできる
	}
	client.hub.register <- client
	names := make([]string, len(client.hub.clients) + 1)
	i := 0
	for k := range client.hub.clients {
		names[i] = client.hub.clients[k]
		i++
	}
	names[i] = userName
	namesJson, _ := json.Marshal(names)
	fmt.Println(namesJson)
	client.hub.broadcast <- namesJson
	go client.writePump()
	go client.readPump()
}