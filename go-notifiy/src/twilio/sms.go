package main

import (
  "net/http"
  "net/url"
  "fmt"
  "strings"
)

func main() {
  // Set initial variables
  accountSid := "TWILIO_ACCOUNT_SID"
  authToken := "TWILIO_AUTH_TOKEN"
  urlStr := "https://api.twilio.com/2010-04-01/Accounts/" + accountSid + "/Messages.json"

  // Build out the data for our message
  v := url.Values{}
  v.Set("To","YOUR_PHONE_NUMBER")
  v.Set("From","YOUR_TWILIO_NUMBER")
  v.Set("Body","Brooklyn's in the house!")
  rb := *strings.NewReader(v.Encode())

  // Create client
  client := &http.Client{}

  req, _ := http.NewRequest("POST", urlStr, &rb)
  req.SetBasicAuth(accountSid, authToken)
  req.Header.Add("Accept", "application/json")
  req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

  // Make request
  resp, _ := client.Do(req)
  fmt.Println(resp.Status)
}
Now it’s time for the moment of the truth. Save your program as twilio.go and run it using the following command.

go run twilio.go
The program s