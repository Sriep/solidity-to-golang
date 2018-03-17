set GOPATH="C:\Users\piers\Documents\Freelancing\Projects\solidity2Go\solidity-to-golang\test"
cd ..
FOR %%f IN (test\test-sols\*.sol) DO (
    mkdir "test\src\%%~nf"
    node main.js %%f "test\src\%%~nf\%%~nf" >jsout.log 2>jserr.log
    echo f | xcopy /f /y test\test-sols\%%~nf_test.go test\src\%%~nf\%%~nf_test.go
)

cd test/src
go test ./... >go-test.out 2>&1
type go-test.out
cd ..


