// api.js
// Métodos genéricos para consumo de API REST usando JavaScript puro (fetch)


const API_BASE_URL = 'https://origemapi.onrender.com'; // Altere para a URL da sua API


// Função genérica para requisições
async function request({ endpoint, method = 'GET', data = null, errorMessage = 'Erro na requisição' }) {
  const options = {
    method,
    headers: {
      'accept': 'application/json, text/html, application/xhtml+xml, */*',
      'accept-language': 'pt-BR,pt;q=0.9,en;q=0.8',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'none',
      'cache-control': 'no-cache',
      'upgrade-insecure-requests': '1',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0'
    }
  };

  // Só adiciona Content-Type e body se houver dados para enviar
  if (data && (method === 'POST' || method === 'PUT')) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(data);
  }

  try {
    console.log(`Iniciando requisição ${method} para ${endpoint}`, options);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    console.log(`Status da resposta: ${response.status} ${response.statusText}`);

    // Se for 404 ou outro erro, lança exceção
    if (!response.ok) {
      throw new Error(`${errorMessage} (${response.status})`);
    }

    // Tenta fazer o parse do JSON
    const responseData = await response.json();
    console.log('Dados recebidos:', responseData);
    return responseData;
  } catch (error) {
    console.error(`Erro na requisição ${endpoint}:`, error);
    throw error;
  }
}

// Métodos específicos
const ApiService = {
  // GET genérico
  get: (endpoint) => request({ endpoint, method: 'GET', errorMessage: 'Erro ao buscar dados' }),

  // POST genérico
  post: (endpoint, data) => request({ endpoint, method: 'POST', data, errorMessage: 'Erro ao criar recurso' }),

  // PUT genérico
  put: (endpoint, data) => request({ endpoint, method: 'PUT', data, errorMessage: 'Erro ao atualizar recurso' }),

  // DELETE genérico
  delete: (endpoint) => request({ endpoint, method: 'DELETE', errorMessage: 'Erro ao deletar recurso' }),

  // GET /products
  getAllProducts: async function () {
    try {
      console.log('Buscando todos os produtos...');
      return await this.get('/products');
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  },

  // GET /{product_id}/product
  getProductById: function (productId) {
    if (!productId) throw new Error('productId é obrigatório');
    return this.get(`/${productId}/product`);
  },

  // PUT /update/product?id=X
  updateProduct: function (data) {
    if (!data) throw new Error('Dados do produto são obrigatórios');
    if (!data.id) throw new Error('O ID do produto é obrigatório');
    
    // Validação dos campos obrigatórios
    if (typeof data.name !== 'string') throw new Error('O campo name deve ser uma string');
    if (typeof data.description !== 'string') throw new Error('O campo description deve ser uma string');
    if (!Number.isInteger(data.qnt_products)) throw new Error('O campo qnt_products deve ser um número inteiro');
    if (typeof data.price !== 'number') throw new Error('O campo price deve ser um número');
    if (typeof data.image !== 'string') throw new Error('O campo image deve ser uma string');

    // Formato esperado do objeto (sem incluir o ID, que vai na URL)
    const productData = {
      name: data.name,
      description: data.description,
      qnt_products: data.qnt_products,
      price: data.price,
      image: data.image
    };

    // Adiciona o ID como query parameter na URL
    return this.put(`/update/product?id=${data.id}`, productData);
  },

  // POST /product
  createProduct: function (data) {
    if (!data) throw new Error('Dados do produto são obrigatórios');
    
    // Validação dos campos obrigatórios
    if (typeof data.name !== 'string') throw new Error('O campo name deve ser uma string');
    if (typeof data.description !== 'string') throw new Error('O campo description deve ser uma string');
    if (!Number.isInteger(data.qnt_products)) throw new Error('O campo qnt_products deve ser um número inteiro');
    if (typeof data.price !== 'number') throw new Error('O campo price deve ser um número');
    if (typeof data.image !== 'string') throw new Error('O campo image deve ser uma string');

    // Formato esperado do objeto
    const productData = {
      name: data.name,
      description: data.description,
      qnt_products: data.qnt_products,
      price: data.price,
      image: data.image
    };

    return this.post('/product', productData);
  },

  // DELETE /{id}/product
  deleteProductById: function (id) {
    if (!id) throw new Error('id é obrigatório');
    return this.delete(`/${id}/product`);
  }
};


// Exemplos de uso:
// ApiService.getAllProducts()
// ApiService.getProductById(123)
// ApiService.updateProduct({ id: 1, nome: 'Novo nome' })
// ApiService.createProduct({ nome: 'Produto novo' })
// ApiService.deleteProductById(1)

export default ApiService;


