import './pre-start'; // Must be the first import
import logger from 'jet-logger';
import server from './server';
import { AppDataSource } from '@config/db';


// Constants
const serverStartMsg = 'Express server started on port: ',
    port = (process.env.PORT || 3000);
//#### Database

AppDataSource.initialize()
    .then(() => {
        console.info("initialize databse success");

    })
    .catch((error: any) => console.log(error));

// Export here and start in a diff file (for testing).

// Start server
server.listen(port, () => {
    logger.info(serverStartMsg + port);
});
