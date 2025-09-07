package com.example.comp9034.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
@Valid
public class DeleteRosterDTO {
    @NotNull(message = "shiftId is required")
    private Long shiftId;

    /** Ensure we only delete the intended employee’s shift */
    @NotBlank(message = "employeeId is required")
    private String employeeId;

    /** Soft cancel by default; set true to hard delete (if you choose to allow it) */
    private Boolean hardDelete = false;
}

