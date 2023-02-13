package transactiondto

type TransactionRequest struct {
	ID         int     `json:"id" `
	PropertyID int     `json:"property_id"`
	Checkin    string  `json:"checkin"`
	Checkout   string  `json:"checkout"`
	Status     string  `json:"status"`
	Total      float64 `json:"total"`
	UserID     int     `json:"user_id"`
}
