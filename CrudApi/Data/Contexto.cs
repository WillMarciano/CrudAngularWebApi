using CrudApi.Models;
using Microsoft.EntityFrameworkCore;

namespace CrudApi.Data
{
    public class Contexto : DbContext
    {
        public DbSet<Pessoa> Pessoas { get; set; }
        public Contexto(DbContextOptions<Contexto> opcoes) : base(opcoes)
        {

        }
    }
}