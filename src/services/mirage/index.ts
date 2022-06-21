import { createServer, Factory, Model, Response, ActiveModelSerializer } from 'miragejs';
import faker from 'faker';

type User = {
  name: string;
  email: string;
  created_at: string;
};

export function makeServer() {
  const server = createServer({
    serializers: {
      application: ActiveModelSerializer,
    },

    models: {
      user: Model.extend<Partial<User>>({})
    },

    factories: {
      user: Factory.extend({
        name(i: number) {
          return `User ${i + 1}`
        },
        email() {
          return faker.internet.email().toLowerCase();
        },
        createdAt() {
          return faker.date.recent(10);
        },
      })
    },

    seeds(server) {
      server.createList('user', 200)
    },

    routes() {
      this.namespace = 'api';
      this.timing = 750; //tempo de resposta

      //Quando chamar a rota users, deve retornar a lista de usuarios da aplicacao
      this.get('/users', function (schema, request) {
        const { page = 1, per_page = 10 } = request.queryParams
        //page é a pagina que quero exibir no momento e per_page é quantos registros mostrar por pagina

        const total = schema.all('user').length //saber quantos registros existem por usuario

        const pageStart = (Number(page) - 1) * Number(per_page);
        const pageEnd = pageStart + Number(per_page);

        const users = this.serialize(schema.all('user'))
          .users
          .sort((a, b) => a.createdAt - b.createdAt)
          .slice(pageStart, pageEnd);

        return new Response(
          200,
          { 'x-total-count': String(total) },
          { users }
        )
      });

      this.get('/users/:id');
      this.post('/users');

      this.namespace = ''; //reseta o namespace
      this.passthrough(); //todas as chamadas enviadas pela rota api passe pelo miragejs
    }
  })

  return server;
}