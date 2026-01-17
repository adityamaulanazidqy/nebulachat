package response

type MessageResponse struct {
	ID            string                 `json:"id"`
	ChatSessionID string                 `json:"chat_session_id"`
	SenderID      string                 `json:"sender_id"`
	SenderName    string                 `json:"sender_name"`
	Text          string                 `json:"text"`
	Timestamp     string                 `json:"timestamp"`
	Status        string                 `json:"status"`
	Avatar        string                 `json:"avatar"`
	Metadata      map[string]interface{} `json:"metadata"`
	ReplyTo       *string                `json:"reply_to"`
	CreatedAt     string                 `json:"created_at"`
}

type AttachmentResponse struct {
	ID          string `json:"id"`
	MessageID   string `json:"message_id"`
	Name        string `json:"name"`
	ContentType string `json:"content_type"`
	Size        int    `json:"size"`
	URL         string `json:"url"`
}
