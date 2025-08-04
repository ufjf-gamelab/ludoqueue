import { it, expect, describe } from 'vitest'
import type { GraphType } from "../src/types.ts";
import { gameReducer } from "../src/Provider.tsx"

describe('Usando gameReducer', async () => { //devo testar direto no gameTick?
    it('Mina 0 deve somar 1', () => {
        const stateTest: GraphType = {
            nodes: [
                {    id: "mine1", name: "Mine 1", type: "mine", val: 0 , max: 5},
            ],
            links: [],
        };
        const result = gameReducer(stateTest,{type: 'game tick'});
        expect(result.nodes[0].val).toBe(1);
   });
   it('Mina não deve somar estando no máximo', () => {
        const stateTest: GraphType = {
            nodes: [
                {    id: "mine1", name: "Mine 1", type: "mine", val: 5 , max: 5},
            ],
            links: [],
        };
        const result = gameReducer(stateTest,{type: 'game tick'});
        expect(result.nodes[0].val).toBe(5);
   });
})
