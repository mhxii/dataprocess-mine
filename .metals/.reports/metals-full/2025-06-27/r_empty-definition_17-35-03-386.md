error id: file:///C:/CodeMine/dataprocess%20mine/backend/app/controllers/MainController.scala:`<none>`.
file:///C:/CodeMine/dataprocess%20mine/backend/app/controllers/MainController.scala
empty definition using pc, found symbol in pc: `<none>`.
empty definition using semanticdb
empty definition using fallback
non-local guesses:

offset: 396
uri: file:///C:/CodeMine/dataprocess%20mine/backend/app/controllers/MainController.scala
text:
```scala
package controllers

import play.api.mvc._
import javax.inject._
import models._
import java.io._

@Singleton
class MainController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

def cleanFull = Action(parse.multipartFormData) { request =>
request.body.file("file") match {
case Some(csv) =>
val inputFile = csv.ref.getAbsoluteFile
println(s"[INFO] Fichier reç@@u : ${inputFile.getAbsolutePath}")

    try {
      val afterMissing = MissingValuesCleaner.clean(inputFile)
      val afterOutliers = OutliersCleaner.clean(afterMissing)
      val afterDedup = DuplicatesCleaner.clean(afterOutliers)
      val finalFile = Normalizer.clean(afterDedup)

      Ok.sendFile(finalFile, inline = true)
    } catch {
      case ex: Exception =>
        ex.printStackTrace()
        InternalServerError(s"Erreur pendant le nettoyage : ${ex.getMessage}")
    }

  case None => BadRequest("Aucun fichier CSV fourni.")
}
}
}
```


#### Short summary: 

empty definition using pc, found symbol in pc: `<none>`.