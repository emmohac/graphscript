package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/awslabs/aws-lambda-go-api-proxy/gorillamux"
	"github.com/gorilla/mux"
)

// Response is of type APIGatewayProxyResponse since we're leveraging the
// AWS Lambda Proxy Request functionality (default behavior)
//
// https://serverless.com/framework/docs/providers/aws/events/apigateway/#lambda-proxy-integration
type Response events.APIGatewayProxyResponse

var muxLambda *gorillamux.GorillaMuxAdapter

func healthy(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("ok From GO Lambda!"))
}

func init() {
	log.Printf("gorillamux cold start")

	Router := mux.NewRouter()

	Router.HandleFunc("/healthcheck", healthy).Methods("GET")

	/* headersOK := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type"})
	originsOK := handlers.AllowedOrigins([]string{"*"})
	methodsOK := handlers.AllowedMethods([]string{"GET", "POST", "OPTIONS", "DELETE", "PUT"})
	*/
	muxLambda = gorillamux.New(Router)
	/* 	port := ":" + os.Getenv("PORT")
	   	fmt.Println("server Running on port", port)
	   	log.Fatal(http.ListenAndServe(port, handlers.CORS(headersOK, originsOK, methodsOK)(Router))) */
}

func Handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// If no name is provided in the HTTP request body, throw an error
	//c += 1
	//fmt.Println("start C is", c)

	fmt.Println("ctx===>", ctx)
	fmt.Println("req ===>", req)
	return muxLambda.ProxyWithContext(ctx, req)
}

func main() {
	lambda.Start(Handler)
}

/**
resp := Response{
	StatusCode:      200,
	IsBase64Encoded: false,
	Body:            buf.String(),
	Headers: map[string]string{
		"Content-Type":           "application/json",
		"X-MyCompany-Func-Reply": "hello-handler",
	},
}
*/
