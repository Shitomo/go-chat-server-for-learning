package main

import (
	"fmt"
	"net/http"
	"os"
)


func main() {
	fmt.Println("Launching server ....")

	//rooms := make(map[string]string)
	//buildフォルダが存在すれば，リクエストに対してそのフォルダの中身を返すファイルサーバーfsを作成
	fs := http.FileServer(http.Dir("./build"))
	//fsをパス"/"へのリクエストに紐づける
	http.Handle("/", fs)

	http.HandleFunc("/ws", wsHandler)

	var port string
	//プログラムがPRODUCTIONとして動作している場合は，現在割り当てられているポートを読み取る
	if os.Getenv("GO_ENV") == "PRODUCTION" {
		port = ":" + os.Getenv("PORT")
	//それ以外の場合は，8081をリッスン
	} else {
		port = ":8081"
	}
	err := http.ListenAndServe(port, nil)
	if err != nil {
		fmt.Println("ListenAndServeError", err)
	}
}
