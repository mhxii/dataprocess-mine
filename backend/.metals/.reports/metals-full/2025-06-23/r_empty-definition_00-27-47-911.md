error id: file:///C:/Users/etifo/dataprocess/app/controllers/HomeController.scala:`<none>`.
file:///C:/Users/etifo/dataprocess/app/controllers/HomeController.scala
empty definition using pc, found symbol in pc: `<none>`.
empty definition using semanticdb
empty definition using fallback
non-local guesses:
	 -javax/inject/`inline`.
	 -javax/inject/`inline`#
	 -javax/inject/`inline`().
	 -play/api/mvc/`inline`.
	 -play/api/mvc/`inline`#
	 -play/api/mvc/`inline`().
	 -`inline`.
	 -`inline`#
	 -`inline`().
	 -scala/Predef.`inline`.
	 -scala/Predef.`inline`#
	 -scala/Predef.`inline`().
offset: 737
uri: file:///C:/Users/etifo/dataprocess/app/controllers/HomeController.scala
text:
```scala
package controllers

import javax.inject._
import play.api.mvc._
import java.io.File
import models.DataCleaner

@Singleton
class HomeController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

def index = Action { implicit request: Request[AnyContent] =>
Ok("Backend opérationnel. Utilise POST /clean pour envoyer un CSV.")
}

def cleanData = Action(parse.multipartFormData) { request =>
request.body.file("csvFile").map { csv =>

  val filename = csv.filename  
  val tempFile = new File(s"/tmp/$filename")  
  csv.ref.copyTo(tempFile, replace = true)  

  val cleanedFile = DataCleaner.clean(tempFile)  

Ok.sendFile(
content = cleanedFile,
fileName = _ => Some(s"cleaned_$filename"),
inl@@ine = false
)

}.getOrElse {  
  BadRequest("Fichier CSV manquant.")  
}  
}
}
```


#### Short summary: 

empty definition using pc, found symbol in pc: `<none>`.