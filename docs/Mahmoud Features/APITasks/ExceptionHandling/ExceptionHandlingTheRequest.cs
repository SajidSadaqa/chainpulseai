namespace APITasks.ExceptionHandling
{
    public class ExceptionHandlingTheRequest
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingTheRequest> _logger;

        public ExceptionHandlingTheRequest(
            RequestDelegate next,
            ILogger<ExceptionHandlingTheRequest> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception while processing the request.");

                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                context.Response.ContentType = "application/json";

                await context.Response.WriteAsJsonAsync(new
                {
                    message = "An unexpected server error occurred."
                });
            }
        }


    }
}
