BASE_URL="http://localhost:8080"

curl -X POST "$BASE_URL/chats/{id}/messages" \
     -H "Content-Type: application/json" \
     -d '{
           "sender_id": "user-456",
           "sender_name": "John Doe",
           "text": "Hello world!",
           "avatar": "http://example.com/avatar.png",
           "metadata": {"source": "mobile"},
           "reply_to": null
         }'

curl -X GET "$BASE_URL/chats/{id}/messages"
