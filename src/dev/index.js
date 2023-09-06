import SwaggerUI from 'swagger-ui'
import "swagger-ui/dist/swagger-ui.css"

SwaggerUI({
  oauth2RedirectUrl: window.location.href + "auth.html",
  url: "openapi.json",
  dom_id: '#swagger-ui',
  deepLinking: true,
  displayOperationId: true
})