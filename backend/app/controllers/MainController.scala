package controllers

import javax.inject._
import play.api.mvc._
import play.api.libs.Files.TemporaryFile
import java.io.File
import models.{MissingDataCleaner, DuplicatesCleaner, OutliersCleaner, Normalizer}
import scala.concurrent.ExecutionContext

@Singleton
class MainController @Inject()(cc: ControllerComponents)(implicit ec: ExecutionContext) extends AbstractController(cc) {

def index = Action { implicit request: Request[AnyContent] =>
Ok("Backend opérationnel. Utilise POST /clean/full pour envoyer un CSV et appliquer tous les nettoyages.")
}

def cleanFull = Action(parse.multipartFormData) { request =>
request.body.file("csvFile").map { csv =>
val inputFile = csv.ref.path.toFile

  // Pipeline de nettoyage : Missing -> Outliers -> Duplicates -> Normalize  
  val step1 = MissingDataCleaner.clean(inputFile)  
  val step2 = OutliersCleaner.clean(step1)  
  val step3 = DuplicatesCleaner.clean(step2)  
  val finalFile = Normalizer.clean(step3)  

  Ok.sendFile(  
    content = finalFile,  
    fileName = _ => Some(s"fully_cleaned_${inputFile.getName}"),  
    inline = false  
  )  

}.getOrElse {  
  BadRequest("Fichier CSV manquant.")  
}  
}
}