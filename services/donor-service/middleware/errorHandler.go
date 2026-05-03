package middleware

import (
	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog/log"
)

func ErrorHandler(c *fiber.Ctx, err error) error {
	code := fiber.StatusInternalServerError
	message := "An unexpected error occurred"

	if e, ok := err.(*fiber.Error); ok {
		code = e.Code
		message = e.Message
	}

	log.Error().
		Err(err).
		Str("method", c.Method()).
		Str("path", c.Path()).
		Msg("Request failed")

	return c.Status(code).JSON(fiber.Map{
		"success": false,
		"message": message,
	})
}
