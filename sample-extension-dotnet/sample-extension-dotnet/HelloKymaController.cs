using System;
using Microsoft.AspNetCore.Mvc;

namespace sample_extension_dotnet
{
    public class HelloKymaController : Controller
    {
        public HelloKymaController()
        {
        }

        //GET /helloworld
        public String Index()
        {
            return "Hello from dotnet app running on Kyma Runtime";
        }
    }
}
