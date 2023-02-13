package authdto

type RegisterRequest struct {
	Fullname string `gorm:"type: varchar(255)" json:"fullname" form:"fullname" `
	Username string `gorm:"type: varchar(255)" json:"username" form:"username" `
	Email    string `gorm:"type: varchar(255)" json:"email" form:"email" `
	Password string `gorm:"type: varchar(255)" json:"password" form:"password" `
	ListAsId string `gorm:"type: varchar(255)" json:"list_as_id" form:"list_as_id" `
	Gender   string `gorm:"type: varchar(255)" json:"gender" form:"gender" `
	Phone    string `gorm:"type: varchar(255)" json:"phone" form:"phone" `
	Address  string `gorm:"type: varchar(255)" json:"address" form:"address" `
	Image    string `gorm:"type: varchar(255)" json:"image" form:"image" `
}
type LoginRequest struct {
	Username string `gorm:"type: varchar(255)" json:"username" validate:"required"`
	Password string `gorm:"type: varchar(255)" json:"password" validate:"required"`
}
