import express from 'express';
import bodyParser from 'body-parser';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import ip from 'ip';
import cors from 'cors';

//test

const app = express();
const myIp = ip.address();
const port = 3000;

dotenv.config();
const supabase = createClient(`${process.env.DATABASE}`, `${process.env.DB_PASSWORD}`);

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.options('*', cors());


app.get('/produtos', async (req, res) => {
    try {
    const { data: products, error } = await supabase.from('produtos').select('*');  
    res.status(200).json(products);
    } catch (error) {
    res.status(500).json({ message: 'Error retrieving products', error });
    }
});

app.get('/produtos/:id', async (req, res) => {
    try {
    const { id } = req.params;
    const { data: product } = await supabase.from('produtos').select('*').eq('id', id);
    res.status(200).json(product[0]);
    } catch (error) {
    res.status(500).json({ message: `Error retrieving product with ID ${id}`, error });
    }
});

app.post('/produtos/add', async (req, res) => {
try {   
    console.log(req.body);
    const { descricao, preco } = req.body;
    const data  = await supabase.from('produtos').insert({ descricao, preco });
    res.status(201).json(data[0]);
} catch (error) {
    res.status(500).json({ message: 'Error ao adicionar produto', error });
} 
});

app.put('/produtos/edit/:id', async (req, res) => {
try {
    const { id } = req.params;
    const { descricao, preco } = req.body;

    await supabase
    .from('produtos')
    .update({ descricao, preco })
    .eq('id', id);

    const { data: updatedProduct } = await supabase
    .from('produtos')
    .select('*')
    .eq('id', id);

    res.status(200).json(updatedProduct[0]);
} catch (error) {
    res.status(500).json({ message: `Erro ao atualizar o produto com ID ${id}`, error });
}
});

app.delete('/produtos/:id', async (req, res) => {
try {
    const { id } = req.params;
    const { data } = await supabase
    .from('produtos')
    .delete()
    .eq('id', id);
    res.status(200).json({ message: `O produto com ID ${id} foi deletado` });
} catch (error) {
    res.status(500).json({ message: `Erro ao deletar o produto com ID ${id}`, error });
}
});


app.listen(port, () => {
console.log(`Server is listening on ${myIp}:${port}`);
});