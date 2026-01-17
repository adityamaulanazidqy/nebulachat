package request

type SendMessageRequest struct {
	SenderID   string                 `json:"sender_id"`
	SenderName string                 `json:"sender_name"`
	Text       string                 `json:"text"`
	Avatar     string                 `json:"avatar"`
	Metadata   map[string]interface{} `json:"metadata"`
	ReplyTo    *string                `json:"reply_to"`
}
