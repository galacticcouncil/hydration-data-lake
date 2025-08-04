import { Router } from 'express';
import { getReserves } from '../controllers/mmReserves.controller';

const mmReservesRouter = Router();

/**
 * @swagger
 * /rest/mm-reserves/state/{underliningAssetId}/{aTokenId}:
 *   get:
 *     summary: Get reserve by underlying asset ID and aToken ID
 *     description: Retrieve a specific money market reserve using a combination of underlying asset ID and token ID.
 *     parameters:
 *       - in: path
 *         name: underliningAssetId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the underlying asset.
 *       - in: path
 *         name: aTokenId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the aToken.
 *     responses:
 *       200:
 *         description: Reserve retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 aTokenTotalSupply:
 *                   type: string
 *                 variableDebtTokenTotalSupply:
 *                   type: string
 *                 tvl:
 *                   type: string
 *                 tvlInRefAssetNormalised:
 *                   type: string
 *                 utilizationRate:
 *                   type: string
 *                 paraBlockHeight:
 *                   type: number
 *       400:
 *         description: Missing required parameters
 *       404:
 *         description: No resources found
 *       500:
 *         description: Internal server error
 */
mmReservesRouter.get('/state/:underliningAssetId/:aTokenId', getReserves);

export default mmReservesRouter;
