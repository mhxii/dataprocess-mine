package controllers

import javax.inject._
import play.api.mvc._
import play.api.libs.Files.TemporaryFile
import java.io._
import java.nio.file.{Files, Paths}
import java.util.zip.{ZipEntry, ZipOutputStream}
import models.{MissingDataCleaner, OutliersCleaner, DuplicatesCleaner, NormalizerCleaner}
import scala.concurrent.ExecutionContext

@Singleton
class MainController @Inject()(cc: ControllerComponents)(implicit ec: ExecutionContext) extends AbstractController(cc) {

  def index = Action { implicit request: Request[AnyContent] =>
    Ok("Backend operationnel. Utilise POST /clean/full pour envoyer un CSV et appliquer tous les nettoyages.")
  }

  def cleanFull = Action(parse.multipartFormData) { request =>
    request.body.file("csvFile").map { csv =>
      val inputFile = csv.ref.path.toFile

      // Recuperer le nom reel depuis le frontend (champ 'nomFile') ou fallback
      val fileName = request.body.dataParts.get("nomFile").flatMap(_.headOption).getOrElse("default.csv")

      val dataParts = request.body.asFormUrlEncoded
      def isEnabled(option: String): Boolean =
        dataParts.get(option).exists(_.headOption.contains("true"))

      val applyMissing = isEnabled("missing")
      val applyOutliers = isEnabled("outliers")
      val applyDuplicates = isEnabled("duplicates")
      val applyNormalize = isEnabled("normalize")

      val log = new StringBuilder()
      log.append(s"[START] Nettoyage du fichier: $fileName\n")

      try {
        var currentFile = inputFile

        if (applyMissing) {
          log.append("[STEP] Traitement des valeurs manquantes...\n")
          currentFile = MissingDataCleaner.clean(currentFile, log = Some(log))
        }

        if (applyOutliers) {
          log.append("[STEP] Detection des valeurs aberrantes...\n")
          currentFile = OutliersCleaner.clean(currentFile, log = Some(log))
        }

        if (applyDuplicates) {
          log.append("[STEP] Suppression des doublons...\n")
          currentFile = DuplicatesCleaner.clean(currentFile, log = Some(log))
        }

        if (applyNormalize) {
          log.append("[STEP] Normalisation des donnees...\n")
          currentFile = NormalizerCleaner.clean(currentFile, log = Some(log))
        }

        log.append(s"[END] Nettoyage termine avec succès.\n")

        // Creer le dossier output/ s'il n'existe pas
        val outputDir = new File("output")
        if (!outputDir.exists()) outputDir.mkdirs()

        val baseName = fileName.stripSuffix(".csv")

        val logFile = new File(outputDir, s"log_Cleaning_${baseName}.txt")
        Files.write(logFile.toPath, log.toString().getBytes())

        val zipFile = new File(outputDir, s"${baseName}.zip")
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

        addToZip(inputFile, s"Original_${fileName}.csv")
        addToZip(currentFile, s"Cleaned_${fileName}.csv")
        addToZip(logFile, s"log_Cleaning_${baseName}.txt")

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
