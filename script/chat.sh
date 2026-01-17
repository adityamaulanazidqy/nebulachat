BASE_URL="http://localhost:8080"

curl -X POST "$BASE_URL/chats" \
     -H "Content-Type: application/json" \
     -d '{
           "id": "chat-123",
           "name": "General Chat",
           "type": "channel",
           "description": "General discussion channel",
           "is_public": true
         }'

curl -X GET "$BASE_URL/chats"

curl -X GET "$BASE_URL/chats/{id}"

curl -X GET "$BASE_URL/chats/{id}/participants"

curl -X POST "$BASE_URL/chats/{id}/participants" \
     -H "Content-Type: application/json" \
     -d '{
           "user_id": "user-456",
           "is_admin": false
         }'
