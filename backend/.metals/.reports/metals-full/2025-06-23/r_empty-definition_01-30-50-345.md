error id: file:///C:/Users/etifo/dataprocess/app/controllers/MissingDataController.scala:`<none>`.
file:///C:/Users/etifo/dataprocess/app/controllers/MissingDataController.scala
empty definition using pc, found symbol in pc: `<none>`.
empty definition using semanticdb
empty definition using fallback
non-local guesses:
	 -javax/inject/request/body/file.
	 -javax/inject/request/body/file#
	 -javax/inject/request/body/file().
	 -play/api/mvc/request/body/file.
	 -play/api/mvc/request/body/file#
	 -play/api/mvc/request/body/file().
	 -request/body/file.
	 -request/body/file#
	 -request/body/file().
	 -scala/Predef.request.body.file.
	 -scala/Predef.request.body.file#
	 -scala/Predef.request.body.file().
offset: 519
uri: file:///C:/Users/etifo/dataprocess/app/controllers/MissingDataController.scala
text:
```scala
package controllers

import javax.inject._
import play.api.mvc._
import java.io.File
import models.DataCleaner
import scala.concurrent.ExecutionContext

@Singleton
class MissingDataController @Inject()(cc: ControllerComponents)(implicit ec: ExecutionContext) extends AbstractController(cc) {

def index = Action { implicit request: Request[AnyContent] =>
Ok("Backend opérationnel. Utilise POST /clean pour envoyer un CSV.")
}

def cleanData = Action(parse.multipartFormData) { request =>

request.body.@@file("csvFile").map { csv =>

val inputFile = csv.ref.path.toFile
val cleanedFile = DataCleaner.clean(inputFile)

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

empty definition using pc, found symbol in pc: `<none>`.