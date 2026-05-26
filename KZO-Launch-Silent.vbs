Dim shell, electronExe, appDir
appDir = "C:\Users\jeane\Desktop\Amboul\KZO-Elite"
electronExe = appDir & "\node_modules\electron\dist\electron.exe"
Set shell = CreateObject("WScript.Shell")
shell.CurrentDirectory = appDir
shell.Run Chr(34) & electronExe & Chr(34) & " " & Chr(34) & appDir & Chr(34), 1, False
