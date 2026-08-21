package finance_control.api.dashboard.api;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import finance_control.api.dashboard.api.dto.DashboardSummaryResponse;
import finance_control.api.dashboard.api.dto.ExpenseByCategoryResponse;
import finance_control.api.dashboard.api.dto.FinancialEvolutionResponse;
import finance_control.api.dashboard.application.DashboardService;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public DashboardSummaryResponse summary() {
        return dashboardService.summary();
    }

    @GetMapping("/evolution")
    public List<FinancialEvolutionResponse> evolution(
            @RequestParam(required = false) Integer months) {
        return dashboardService.evolution(months);
    }

    @GetMapping("/expenses-by-category")
    public List<ExpenseByCategoryResponse> expensesByCategory() {
        return dashboardService.expensesByCategory();
    }
}
