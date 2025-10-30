using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class SmartSchedulerController : ControllerBase
    {
        [HttpPost("{projectId}/schedule")]
        public IActionResult GenerateSchedule(int projectId, [FromBody] ScheduleRequest request)
        {
            if (request == null || request.Tasks == null || request.Tasks.Count == 0)
                return BadRequest("No tasks provided.");

            var schedule = new List<object>();
            DateTime currentDate = request.StartDate;
            double remainingHours = request.AvailableHoursPerDay;

            foreach (var task in request.Tasks)
            {
                double hoursLeft = task.EstimatedHours;
                while (hoursLeft > 0)
                {
                    if (remainingHours >= hoursLeft)
                    {
                        schedule.Add(new { Task = task.Name, Date = currentDate.ToString("yyyy-MM-dd") });
                        remainingHours -= hoursLeft;
                        hoursLeft = 0;
                    }
                    else
                    {
                        schedule.Add(new { Task = task.Name, Date = currentDate.ToString("yyyy-MM-dd") });
                        hoursLeft -= remainingHours;
                        remainingHours = request.AvailableHoursPerDay;
                        currentDate = currentDate.AddDays(1);
                    }
                }
            }

            return Ok(new
            {
                ProjectId = projectId,
                Schedule = schedule
            });
        }
    }

    public class ScheduleRequest
    {
        public double AvailableHoursPerDay { get; set; }
        public DateTime StartDate { get; set; }
        public List<TaskItem> Tasks { get; set; } = new();
    }

    public class TaskItem
    {
        public string Name { get; set; } = string.Empty;
        public double EstimatedHours { get; set; }
    }
}
