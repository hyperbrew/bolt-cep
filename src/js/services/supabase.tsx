import {createClient} from "@supabase/supabase-js";
import * as dotenv from 'dotenv';
import endpoint from '../../../endpoint.config'



// dotenv.config();

// export const supabase = createClient(
//     'https://qxahhpdjxwkmbzydxtul.supabase.co',
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMTk5MTk5OCwiZXhwIjoxOTQ3NTY3OTk4fQ.iz-TntdZElx_nRdVkcfkB62oMInXBzni5w6xHhPrsKg'
// );

export const supabase = createClient(
    'https://qxahhpdjxwkmbzydxtul.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMTk5MTk5OCwiZXhwIjoxOTQ3NTY3OTk4fQ.iz-TntdZElx_nRdVkcfkB62oMInXBzni5w6xHhPrsKg'
);
