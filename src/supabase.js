import { createClient } from '@supabase/supabase-js'

// Conexão com o Supabase (banco de dados online).
//
// Estas duas informações são PÚBLICAS (feitas para ficar no site):
// a segurança de verdade vem das regras do banco (RLS) e do login.
// Se um dia você trocar de projeto Supabase, atualize os dois valores
// abaixo e publique o site novamente.
const SUPABASE_URL = 'https://vwphnndyusfcgudyujsr.supabase.co'
const SUPABASE_KEY = 'sb_publishable_uHq2G2lyZHGHaeddIQ_UcQ_6-4jvyHm'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
