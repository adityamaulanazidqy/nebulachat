BASE_URL="http://localhost:8080"

curl -X POST "$BASE_URL/users" \
     -H "Content-Type: application/json" \
     -d '{"username": "Aditya Maulana Zidqy"}'

curl -X GET "$BASE_URL/users"

curl -X GET "$BASE_URL/users/{id}"
