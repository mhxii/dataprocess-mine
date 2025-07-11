error id: file:///C:/CodeMine/dataprocess%20mine/backend/app/controllers/MainController.scala:`<none>`.
file:///C:/CodeMine/dataprocess%20mine/backend/app/controllers/MainController.scala
empty definition using pc, found symbol in pc: `<none>`.
empty definition using semanticdb
empty definition using fallback
non-local guesses:
	 -javax/inject/request.
	 -play/api/mvc/request.
	 -java/io/request.
	 -request.
	 -scala/Predef.request.
offset: 734
uri: file:///C:/CodeMine/dataprocess%20mine/backend/app/controllers/MainController.scala
text:
```scala
package controllers

import javax.inject._
import play.api.mvc._
import play.api.libs.Files.TemporaryFile
import java.io._
import java.nio.file.{Files, Paths}
import java.util.zip.{ZipEntry, ZipOutputStream}
import models.{MissingDataCleaner, OutliersCleaner, DuplicatesCleaner, Normalizer}
import scala.concurrent.ExecutionContext

@Singleton
class MainController @Inject()(cc: ControllerComponents)(implicit ec: ExecutionContext) extends AbstractController(cc) {

  def index = Action { implicit request: Request[AnyContent] =>
    Ok("Backend opérationnel. Utilise POST /clean/full pour envoyer un CSV et appliquer tous les nettoyages.")
  }

  def cleanFull = Action(parse.multipartFormData) { request =>
    re@@quest.body.file("csvFile").map { csv =>
      val inputFile = csv.ref.path.toFile
      val fileName = inputFile.getName

      val log = new StringBuilder()
      log.append(s"[START] Nettoyage du fichier: $fileName\n")

      try {
        // Pipeline de nettoyage avec log
        val step1 = MissingDataCleaner.clean(inputFile, log = Some(log))
        val step2 = OutliersCleaner.clean(step1, log = Some(log))
        val step3 = DuplicatesCleaner.clean(step2, log = Some(log))
        val finalFile = Normalizer.clean(step3, log = Some(log))

        // Écrire le log dans un fichier temporaire
        val logFile = new File(System.getProperty("java.io.tmpdir"), s"log_cleaning_$fileName.txt")
        Files.write(logFile.toPath, log.toString().getBytes())

        // Créer un fichier .zip contenant le CSV nettoyé et le log
        val zipFile = new File(System.getProperty("java.io.tmpdir"), s"output_${fileName}.zip")
        val zip = new ZipOutputStream(new FileOutputStream(zipFile))

        def addToZip(file: File, nameInZip: String): Unit = {
          zip.putNextEntry(new ZipEntry(nameInZip))
          val in = new BufferedInputStream(new FileInputStream(file))
          val buffer = new Array[Byte](1024)  // Fixed: Added type parameter and size
          var len = 0
          while ({ len = in.read(buffer); len > 0 }) {
            zip.write(buffer, 0, len)
          }
          in.close()
          zip.closeEntry()
        }

        addToZip(finalFile, s"fully_cleaned_$fileName.csv")
        addToZip(logFile, s"log_cleaning_$fileName.txt")

        zip.close()

        Ok.sendFile(
          content = zipFile,
          fileName = _ => Some(zipFile.getName),
          inline = false
        )

      } catch {
        case e: Exception =>
          InternalServerError(s"Erreur pendant le nettoyage : ${e.getMessage}")
      }

    }.getOrElse {
      BadRequest("Fichier CSV manquant.")
    }
  }
}
```


#### Short summary: 

empty definition using pc, found symbol in pc: `<none>`.