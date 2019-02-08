import SwaggerUI from 'swagger-ui'
import "swagger-ui/dist/swagger-ui.css"

SwaggerUI({
  url: "openapi.json",
  dom_id: '#swagger-ui',
  docExpansion: 'full',
  deepLinking: true,
  displayOperationId: true
})