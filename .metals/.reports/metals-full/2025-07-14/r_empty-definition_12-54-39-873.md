error id: file:///C:/CodeMine/dataprocess%20mine/backend/app/controllers/NormalizerController.scala:`<none>`.
file:///C:/CodeMine/dataprocess%20mine/backend/app/controllers/NormalizerController.scala
empty definition using pc, found symbol in pc: `<none>`.
empty definition using semanticdb
empty definition using fallback
non-local guesses:
	 -javax/inject/scala/concurrent.
	 -play/api/mvc/scala/concurrent.
	 -scala/concurrent.
	 -scala/Predef.scala.concurrent.
offset: 188
uri: file:///C:/CodeMine/dataprocess%20mine/backend/app/controllers/NormalizerController.scala
text:
```scala
// Mohamed SALL (Et en fin normalisé les données )
package controllers

import javax.inject._
import play.api.mvc._
import java.io.File
import models.Normalizer
import scala.concurr@@ent.ExecutionContext

@Singleton
class NormalizerController @Inject()(cc: ControllerComponents)(implicit ec: ExecutionContext) extends AbstractController(cc) {

def index = Action { implicit request: Request[AnyContent] =>
Ok("Backend opérationnel. Utilise POST /clean pour envoyer un CSV.")
}

def normalize = Action(parse.multipartFormData) { request =>

request.body.file("csvFile").map { csv =>

val inputFile = csv.ref.path.toFile
val cleanedFile = Normalizer.clean(inputFile)

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