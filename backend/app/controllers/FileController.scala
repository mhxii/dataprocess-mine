package controllers

import javax.inject._
import play.api.mvc._
import java.io.File
import java.nio.file.Paths
import scala.concurrent.ExecutionContext

@Singleton
class FileController @Inject()(cc: ControllerComponents)(implicit ec: ExecutionContext) extends AbstractController(cc) {

  def downloadZip(filename: String) = Action {
    val filePath = Paths.get("output", filename)
    val file = filePath.toFile
    if (file.exists()) {
      Ok.sendFile(file, fileName = _ => Some(filename))
    } else {
      NotFound("Fichier non trouvé")
    }
  }

}
