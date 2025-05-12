using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.AutoMapper;
using EventManagement.Domains;

namespace EventManagement.Services.EventAppService.DTO
{

    [AutoMapTo(typeof(Ticket))]
    public class CreateTicketDto
    {
        [Required]
        public string Name { get; set; }

        public string Description { get; set; }

        [Required(ErrorMessage = "Price must be greater than 0")]
        
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Quantity must be greater than 0")]
      
        public int Quantity { get; set; }

        public TicketType Type { get; set; }
    }
}

public enum TicketType
{
    General = 0,
    VIP = 1,
    EarlyBird = 2
}

