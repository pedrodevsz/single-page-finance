package finance_control.api.shared.exception;

import java.net.URI;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@org.springframework.web.bind.annotation.RestControllerAdvice
public class ApiExceptionHandler extends ResponseEntityExceptionHandler {

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            @NonNull HttpHeaders headers,
            @NonNull HttpStatusCode status,
            @NonNull WebRequest request
    ) {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        problemDetail.setTitle("Falha de validação");
        problemDetail.setDetail("Um ou mais campos estão inválidos.");
        problemDetail.setInstance(resolveInstance(request));
        problemDetail.setProperty("errors", extractFieldErrors(ex));

        return ResponseEntity.status(problemDetail.getStatus()).body(problemDetail);
    }

    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(
            org.springframework.http.converter.HttpMessageNotReadableException ex,
            @NonNull HttpHeaders headers,
            @NonNull HttpStatusCode status,
            @NonNull WebRequest request
    ) {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        problemDetail.setTitle("Corpo da requisição inválido");
        problemDetail.setDetail("Não foi possível ler os dados enviados.");
        problemDetail.setInstance(resolveInstance(request));

        return ResponseEntity.status(problemDetail.getStatus()).body(problemDetail);
    }

    @Override
    protected ResponseEntity<Object> handleExceptionInternal(
            Exception ex,
            Object body,
            @NonNull HttpHeaders headers,
            @NonNull HttpStatusCode statusCode,
            @NonNull WebRequest request
    ) {
        if (body instanceof ProblemDetail problemDetail) {
            if (problemDetail.getInstance() == null) {
                problemDetail.setInstance(resolveInstance(request));
            }
            return ResponseEntity.status(statusCode).body(problemDetail);
        }

        return super.handleExceptionInternal(ex, body, headers, statusCode, request);
    }

    private Map<String, String> extractFieldErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new LinkedHashMap<>();

        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            errors.putIfAbsent(fieldError.getField(), fieldError.getDefaultMessage());
        }

        return errors;
    }

    private URI resolveInstance(WebRequest request) {
        if (request instanceof ServletWebRequest servletWebRequest) {
            return URI.create(servletWebRequest.getRequest().getRequestURI());
        }

        return URI.create("");
    }
}
