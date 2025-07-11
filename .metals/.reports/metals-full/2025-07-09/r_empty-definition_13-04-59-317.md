error id: file:///C:/CodeMine/dataprocess%20mine/backend/app/controllers/OutliersController.scala:`<none>`.
file:///C:/CodeMine/dataprocess%20mine/backend/app/controllers/OutliersController.scala
empty definition using pc, found symbol in pc: `<none>`.
empty definition using semanticdb
empty definition using fallback
non-local guesses:

offset: 674
uri: file:///C:/CodeMine/dataprocess%20mine/backend/app/controllers/OutliersController.scala
text:
```scala
// Aissatou Diallo (Vérifier la présence des valeurs aberrants et les traités )
package controllers

import javax.inject._
import play.api.mvc._
import java.io.File
import models.OutliersCleaner
import scala.concurrent.ExecutionContext

@Singleton
class OutliersController @Inject()(cc: ControllerComponents)(implicit ec: ExecutionContext) extends AbstractController(cc) {

def index = Action { implicit request: Request[AnyContent] =>
Ok("Backend opérationnel. Utilise POST /clean pour envoyer un CSV.")
}

def cleanOutliers = Action(parse.multipartFormData) { request =>

request.body.file("csvFile").map { csv =>

val inputFile = csv.ref.path.toFile
@@val cleanedFile = OutliersCleaner.clean(inputFile)
val log = new StringBuilder()
val outlierCleaned = OutliersCleaner.clean(step1, log = Some(log))
println(log.toString) // ou log dans un fichier

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