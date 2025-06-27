error id: file:///C:/CodeMine/dataprocess%20mine/backend/app/controllers/DuplicatesController.scala:
file:///C:/CodeMine/dataprocess%20mine/backend/app/controllers/DuplicatesController.scala
empty definition using pc, found symbol in pc: 
empty definition using semanticdb
empty definition using fallback
non-local guesses:

offset: 73
uri: file:///C:/CodeMine/dataprocess%20mine/backend/app/controllers/DuplicatesController.scala
text:
```scala
// Mamie Sene (Vérifier la présence des valeurs dupliquées et les traités@@ )
package controllers

import javax.inject._
import play.api.mvc._
import java.io.File
import models.DuplicatesCleaner
import scala.concurrent.ExecutionContext

@Singleton
class DuplicatesController @Inject()(cc: ControllerComponents)(implicit ec: ExecutionContext) extends AbstractController(cc) {

def index = Action { implicit request: Request[AnyContent] =>
Ok("Backend opérationnel. Utilise POST /clean pour envoyer un CSV.")
}

def cleanDuplicates = Action(parse.multipartFormData) { request =>

request.body.file("csvFile").map { csv =>

val inputFile = csv.ref.path.toFile
val cleanedFile = DuplicatesCleaner.clean(inputFile)

Ok.sendFile(
content = cleanedFile,
fileName = _ => Some(s"cleaned_${inputFile.getName}"),
inline = false
)

}.getOrElse {
BadRequest("Fichier CSV manquant.")
}
}
}
```


#### Short summary: 

empty definition using pc, found symbol in pc: 