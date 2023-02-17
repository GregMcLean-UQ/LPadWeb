<?php
// this code acceps the uploaded data file from the LPad. the filename is datafile.tmp
// the contents of the incoming file is appended to the tmp file in the LPad\Data directory. if successful sends a message back
// another program then services the data

if ($_FILES["file"]["error"] > 0)
  {
  echo "Error: " . $_FILES["file"]["error"] . "<br>";
  }
else
  {
  
  // get the file name in the data directory
  $dataDir = "C:\\LPad\\Data\\";
  $incomingFile = $_FILES["file"]["tmp_name"];
  $tempDataFile = $dataDir . $_FILES["file"]["name"];
  
  // Open the file to get existing content
  $current = file_get_contents($incomingFile);
  
  // Write the contents to the file, using the FILE_APPEND flag to append the content to the end of the file
  file_put_contents($tempDataFile, $current, FILE_APPEND);
  
  // send a reply
  echo "OK" . "<br>";
  
  // delete lock file if exists
 // unlink('.lock');
  }
?>