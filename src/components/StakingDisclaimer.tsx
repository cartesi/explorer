import React from 'react';

const StakingDisclaimer = () => {
    return (
        <div className="staking-disclaimer body-text-2 p-2 pt-4">
            <i className="fas fa-info-circle px-1"></i> Please read carefully
            before you stake:
            <ul className="pl-4 pt-2">
                <li>
                    This is a PoS system and thus, probabilistic. It can take a
                    much longer time for you to produce blocks than the
                    estimated average
                </li>
                <li>
                    Estimated rewards can be highly variable, depending on
                    chance and on the total amount of CTSI staked by everyone in
                    the network
                </li>
                <li>
                    Whenever your node is unavailable, you miss the chance of
                    producing blocks. Cartesi's node depends on the availability
                    of the configured Ethereum node, which is also prone to
                    unavailability
                </li>
                <li>
                    It is important that you understand how your node will spend
                    ETH gas fees. Fees can be high depending on gas price
                    fluctuations
                </li>
                <li>Read the tutorial carefully</li>
                <li>
                    By running the above software, you are agreeing to the
                    open-source licenses present on our{' '}
                    <a
                        href="https://github.com/cartesi/noether/blob/master/LICENSE"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Github
                    </a>
                    . The software has been tested and audited, but you run it
                    at your own risk
                </li>
            </ul>
        </div>
    );
};

export default StakingDisclaimer;
