<?php

if ($_SERVER["REQUEST_METHOD"] === "POST")
{
  if (isset($_GET["survey"]))
  {
    // AJAX form submission
    $survey = json_decode($_GET["survey"]);

    $result = json_encode(array(
      "email" => $survey->email,
      "answer_1" => $survey->question_1,
        "answer_2" => $survey->question_2,
        "answer_3" => $survey->question_3));


    // Set "file" to whatever the file name is.
    $file = "survey";

    // Gets the extension.
    preg_match("/([a-zA-Z0-9_-]+).([a-zA-Z0-9]+)/", $file, $extension);

    // Gets the current timestamp.
    $timestamp = time();

    // Combines the extension with the timestamp. You can remove the echo statement. Use the rename() function to rename the file.
    $newName = $file."-".$timestamp;
    $survey_dir = "survey/";


    $myfile = fopen($survey_dir.$newName, "w") or die("Unable to open file!");
    fwrite($myfile, $result);
    fclose($myfile);
  }
  else
  {
    $result = "INVALID REQUEST DATA";
  }

  echo $result;
}
?>