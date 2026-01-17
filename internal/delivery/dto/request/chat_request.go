package request

type CreateChatSessionRequest struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Type        string `json:"type"` // channel or direct
	Description string `json:"description"`
	IsPublic    bool   `json:"is_public"`
}

type AddParticipantRequest struct {
	UserID  string `json:"user_id"`
	IsAdmin bool   `json:"is_admin"`
}
