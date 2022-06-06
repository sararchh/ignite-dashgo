import { createServer, Factory, Model } from 'miragejs';
import faker from 'faker';

type User = {
  name: string;
  email: string;
  created_at: string;
};

export function makeServer() {
  const server = createServer({
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

      this.get('/users'); //Quando chamar a rota users, deve retornar a lista de usuarios da aplicacao
      this.post('/users');

      this.namespace = ''; //reseta o namespace
      this.passthrough(); //todas as chamadas enviadas pela rota api passe pelo miragejs
    }
  })

  return server;
}