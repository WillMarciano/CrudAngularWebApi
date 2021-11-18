using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CrudApi.Data;
using CrudApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CrudApi.Controllers
{
    [Route("api/[controller]")]
    public class PessoasController : ControllerBase
    {
        private readonly Contexto _contexto;

        public PessoasController(Contexto contexto)
        {
            _contexto = contexto;
        }

        [HttpGet]
        [Route("")]
        public async Task<ActionResult<IEnumerable<Pessoa>>> GetAll()
        {
            var pessoas = await _contexto.Pessoas.AsNoTracking().ToListAsync();
            return Ok(pessoas);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<ActionResult<Pessoa>> GetById(int id)
        {
            var pessoa = await _contexto.Pessoas.FirstOrDefaultAsync(x => x.PessoaId == id);
            if (pessoa == null)
                return NotFound(new { message = "Ops, Registro não encontrado" });
            return Ok(pessoa);
        }

        [HttpPost]
        [Route("")]
        public async Task<ActionResult<List<Pessoa>>> Post([FromBody] Pessoa model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                _contexto.Pessoas.Add(model);
                await _contexto.SaveChangesAsync();
                return Ok(model);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Ops, Não foi possível adicionar o registro, {ex}" });
            }
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<ActionResult<List<Pessoa>>> Put(int id, [FromBody] Pessoa model)
        {
            if (id != model.PessoaId)
                return NotFound(new { message = "Ops, Registro não encontrado" });

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                _contexto.Entry<Pessoa>(model).State = EntityState.Modified;
                await _contexto.SaveChangesAsync();
                return Ok(model);
            }
            catch (DbUpdateConcurrencyException)
            {
                return BadRequest(new { message = $"Este registro já foi atualizado" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Ops, não foi possível atualizar o registro, {ex}" });
            }
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<ActionResult<List<Pessoa>>> Delete(int id)
        {
            var category = await _contexto.Pessoas.FirstOrDefaultAsync(x => x.PessoaId == id);
            if (category == null)
                return NotFound(new { message = "Registro não encontrado" });
            try
            {
                _contexto.Pessoas.Remove(category);
                await _contexto.SaveChangesAsync();
                return Ok(new { message = "Registro Removido com sucesso" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Ops, não foi possível remover o registro, {ex}" });
            }
        }
    }
}