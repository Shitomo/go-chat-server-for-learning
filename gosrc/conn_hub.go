package main

type ConnHub struct {
	clients map[*Client]string
	broadcast chan []byte
	register chan *Client
	unregister chan *Client
}

func newConnHub() *ConnHub {
	return &ConnHub{
		clients: make(map[*Client]string),
		broadcast: make(chan []byte),
		register: make(chan *Client),
		unregister: make(chan *Client),
	}
}

func(hub *ConnHub) run() {
	for {
		select {
		case client := <- hub.register:
			hub.clients[client] = client.name
			//joinMessageJson, _ := json.Marshal(client.name + "join the room" + client.roomName)
			//client.hub.broadcast <- joinMessageJson
		case client := <- hub.unregister:
			if _,ok := hub.clients[client]; ok {
				delete(hub.clients, client)
				close(client.send)
			}
		case message := <-hub.broadcast:
			for client := range hub.clients {
				select {
				//メッセージの書き込み待ち．タイムアウトあり
				case client.send <- message:
				default:
					close(client.send)
					delete(hub.clients, client)
				}
			}
		}
	}
}