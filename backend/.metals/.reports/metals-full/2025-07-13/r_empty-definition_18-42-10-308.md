error id: file:///C:/CodeMine/dataprocess%20mine/backend/app/controllers/FileController.scala:`<none>`.
file:///C:/CodeMine/dataprocess%20mine/backend/app/controllers/FileController.scala
empty definition using pc, found symbol in pc: `<none>`.
empty definition using semanticdb
empty definition using fallback
non-local guesses:
	 -javax/inject/file.
	 -javax/inject/file#
	 -javax/inject/file().
	 -play/api/mvc/file.
	 -play/api/mvc/file#
	 -play/api/mvc/file().
	 -file.
	 -file#
	 -file().
	 -scala/Predef.file.
	 -scala/Predef.file#
	 -scala/Predef.file().
offset: 334
uri: file:///C:/CodeMine/dataprocess%20mine/backend/app/controllers/FileController.scala
text:
```scala
package controllers

import javax.inject._
import play.api.mvc._
import java.io.File
import java.nio.file.Paths

@Singleton
class FileController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

  def downloadZip(filename: String) = Action {
    val filePath = Paths.get("output", filename)
    val fil@@e = filePath.toFile
    if (file.exists()) {
      Ok.sendFile(file, fileName = _ => Some(filename))
    } else {
      NotFound("Fichier non trouvé")
    }
  }

}

```


#### Short summary: 

empty definition using pc, found symbol in pc: `<none>`.