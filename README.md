# Classificação Web

Este diretório contém os scripts necessários para realizar a predição de uma imagem ou conjunto de imagens utilizando um modelo Yolov8n-cls em formato .onnx, a imagem ou conjunto de imagens e um arquivo .json com rótulos das classes do modelo

## Tabela de Conteúdo

- [Tabela de Conteúdo](#tabela-de-conteúdo)
- [Começando](#começando)
  - [Pré-requisitos](#pré-requisitos)
  - [Estrutura de arquivos](#estrutura-de-arquivos)
  - [Descrição dos arquivos](#Descrição-dos-arquivos)
  - [Exemplos de uso](#Exemplos-de-uso)
  - [Observações](#estrutura-de-arquivos)
  - [Edição](#edição)

<!-- GETTING STARTED -->

## Começando

Para começar a utilizar este módulo do projeto, é necessário ter alguns pré-requisitos de ambiente.

### Pré-requisitos

1. Posse de um arquivo .onnx de modelo de classificação, um .json que possui os rótulos das classes que o modelo treinou com e imagens.
2. É necessário que seja seguida a estrutura de arquivos descrita em [Estrutura de Arquivos](###Estrutura-de-Arquivos) para o funcionamento dos códigos.


## Estrutura de Arquivos

A estrutura de arquivos dentro deste diretório deve ser organizada da seguinte forma:

```bash
classification
├── index.html
├── placeholder640x640.svg
├── README.md
├── reset.css
├── script.js
└── style.css
```
Serão explicados os arquivos e diretórios na seção de [Edição](#edição).

## Descrição dos Arquivos
- **index.html**: Arquivo HTML principal que define a estrutura da página web.
- **placeholder640x640.svg**: Imagem placeholder usada na página web.
- **reset.css**: Arquivo CSS que redefine os estilos padrão do navegador para garantir a consistência da página web.
- **script.js**: Arquivo JavaScript que controla o comportamento interativo da página web.
- **style.css**: Arquivo CSS que define os estilos para a página web.

## Exemplo de uso
1. Abra o arquivo index.html em um navegador web.
2. Utilize a interface para carregar as imagens, rótulos, modelo e visualizar as predições do modelo.

## Observações
- Certifique-se de que os arquivos .onnx e .json estão no formato correto e que as imagens a serem classificadas estão em um formato suportado (e.g., .jpg, .jpeg, .png).

## Edição
Esta seção descreve brevemente cada diretório e arquivo criado.

- **index.html**: Estrutura da página web para carregar e exibir imagens classificadas.
- **placeholder640x640.svg**: Imagem usada como placeholder na interface.
- **reset.css**: CSS para redefinir os estilos padrão do navegador.
- **script.js**: JavaScript que controla a interação da página web.
- **style.css**: CSS que define os estilos da página web.