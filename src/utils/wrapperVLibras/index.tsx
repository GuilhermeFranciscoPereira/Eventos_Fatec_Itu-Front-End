'use client';
import VLibras from 'vlibras-nextjs';

export default function WrapperVLibras(): React.ReactElement {
    return (
        <div>
            {/* To use the v libras api from the gov, to understand more, read: 
            https://www.gov.br/conecta/catalogo/apis/vlibras/vlibras-v3-1-swagger-artesanal-json/swagger_view! */}
            {<VLibras forceOnload />}
        </div>
    )
}