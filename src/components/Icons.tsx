// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { createIcon } from '@chakra-ui/icons';

import React from 'react';

export const PencilIcon = createIcon({
    path: (
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M1.26587 16.0453L1.29133 19.8929H5.27749L20.5089 5.30662L16.4963 1.46484L1.26587 16.0453Z"
            stroke="#232222"
            stroke-width="1.5"
        />
    ),
    viewBox: '0 0 22 21',
    defaultProps: { width: '22', height: '21' },
});

export const DashboardIcon = createIcon({
    displayName: 'DashboardIcon',
    viewBox: '0 0 25 25',
    path: (
        <path
            d="M3.81641 13.6543H11.8164V3.6543H3.81641V13.6543ZM3.81641 21.6543H11.8164V15.6543H3.81641V21.6543ZM13.8164 21.6543H21.8164V11.6543H13.8164V21.6543ZM13.8164 3.6543V9.6543H21.8164V3.6543H13.8164Z"
            fill="currentColor"
        />
    ),
});

export const DelegateIcon = createIcon({
    displayName: 'DelegateIcon',
    viewBox: '0 0 25 25',
    path: (
        <path
            d="M19.8525 12.8809V19.8809H5.85254V12.8809H3.85254V19.8809C3.85254 20.9809 4.75254 21.8809 5.85254 21.8809H19.8525C20.9525 21.8809 21.8525 20.9809 21.8525 19.8809V12.8809H19.8525ZM13.8525 13.5509L16.4425 10.9709L17.8525 12.3809L12.8525 17.3809L7.85254 12.3809L9.26254 10.9709L11.8525 13.5509V3.88086H13.8525V13.5509Z"
            fill="currentColor"
        />
    ),
});

export const CheckCircleIcon = createIcon({
    displayName: 'CheckCircleIcon',
    viewBox: '0 0 26 26',
    path: (
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M24 13C24 19.0751 19.0751 24 13 24C6.92487 24 2 19.0751 2 13C2 6.92487 6.92487 2 13 2C19.0751 2 24 6.92487 24 13ZM26 13C26 20.1797 20.1797 26 13 26C5.8203 26 0 20.1797 0 13C0 5.8203 5.8203 0 13 0C20.1797 0 26 5.8203 26 13ZM7.57631 13.3025L10.8776 16.1015L19.2613 9L20.3776 9.94642L10.8776 18.001L6.45215 14.2489L7.57631 13.3025Z"
            fill="currentColor"
        />
    ),
});

export const PoolBalanceIcon = createIcon({
    displayName: 'PoolBalanceIcon',
    viewBox: '0 0 26 26',
    path: (
        <g>
            <path
                d="M9.75027 14.2497H0V24H9.75027V14.2497ZM6.75019 20.9999H3.00008V17.2498H6.75019V20.9999Z"
                fill="currentColor"
            />
            <path
                d="M9.75027 1.12435H0V10.8746H9.75027V1.12435ZM6.75019 7.87454H3.00008V4.12444H6.75019V7.87454Z"
                fill="currentColor"
            />
            <path
                d="M22.8756 14.2497H13.1253V24H22.8756V14.2497ZM19.8755 20.9999H16.1254V17.2498H19.8755V20.9999Z"
                fill="currentColor"
            />
            <path
                d="M20.7419 1.05594C20.0639 0.378547 19.1446 -0.00195312 18.1862 -0.00195312C17.2277 -0.00195312 16.3085 0.378547 15.6304 1.05594L13.4292 3.25712C12.7518 3.93518 12.3713 4.85443 12.3713 5.81288C12.3713 6.77134 12.7518 7.69059 13.4292 8.36865L15.6304 10.5698C16.3085 11.2472 17.2277 11.6277 18.1862 11.6277C19.1446 11.6277 20.0639 11.2472 20.7419 10.5698L22.9431 8.36865C23.6205 7.69059 24.001 6.77134 24.001 5.81288C24.001 4.85443 23.6205 3.93518 22.9431 3.25712L20.7419 1.05594ZM20.8243 6.24582L18.6231 8.44968C18.5073 8.56186 18.3524 8.62458 18.1912 8.62458C18.03 8.62458 17.8751 8.56186 17.7593 8.44968L15.5574 6.2485C15.4449 6.13244 15.3821 5.97717 15.3821 5.81556C15.3821 5.65395 15.4449 5.49868 15.5574 5.38263L17.7593 3.1781C17.8753 3.06563 18.0306 3.00274 18.1922 3.00274C18.3538 3.00274 18.5091 3.06563 18.6251 3.1781L20.8263 5.37995C20.9391 5.49584 21.0022 5.65117 21.0022 5.81288C21.0022 5.9746 20.9391 6.12992 20.8263 6.24582H20.8243Z"
                fill="currentColor"
            />
        </g>
    ),
});

export const StakeIcon = createIcon({
    displayName: 'StakeIcon',
    viewBox: '0 0 24 24',
    path: (
        <g>
            <path
                d="M9.69568 6.29412C9.84237 6.32213 9.9638 6.42361 10.0163 6.56208L11.4039 10.2221C11.4872 10.4418 11.3748 10.6868 11.1528 10.7693C10.9308 10.8518 10.6833 10.7405 10.6 10.5207L9.45875 7.51031L6.55497 10.658C6.39509 10.8313 6.12357 10.8435 5.9485 10.6852C5.77344 10.5269 5.76113 10.2581 5.92101 10.0848L9.2974 6.42482C9.39815 6.31561 9.54899 6.26611 9.69568 6.29412Z"
                fill="currentColor"
            />
            <path
                d="M7.42848 13.6565C7.65044 13.574 7.89792 13.6853 7.98122 13.905L9.12274 16.916L10.6158 15.3001C10.7759 15.127 11.0474 15.115 11.2223 15.2734C11.3973 15.4318 11.4094 15.7006 11.2493 15.8738L9.28363 18.0012C9.18284 18.1103 9.03203 18.1597 8.88541 18.1316C8.7388 18.1036 8.61744 18.0021 8.56497 17.8637L7.17741 14.2037C7.0941 13.9839 7.20651 13.7389 7.42848 13.6565Z"
                fill="currentColor"
            />
            <path
                d="M10.6176 15.2753L12.0514 13.7427L12.6814 14.3202L11.2475 15.8529L10.6176 15.2753Z"
                fill="currentColor"
            />
            <path
                d="M3.48003 10.1294C3.56022 10.0148 3.69208 9.94642 3.8329 9.94642H8.61998C8.79888 9.94642 8.95902 10.0563 9.02189 10.2221L10.3049 13.6064H14.1519L13.0865 10.7964H10.9788C10.7417 10.7964 10.5496 10.6061 10.5496 10.3714C10.5496 10.1367 10.7417 9.94642 10.9788 9.94642H13.3839C13.5628 9.94642 13.723 10.0563 13.7858 10.2221L15.1734 13.8821C15.2229 14.0126 15.2046 14.1588 15.1244 14.2734C15.0442 14.388 14.9123 14.4564 14.7715 14.4564H10.0075C9.82864 14.4564 9.6685 14.3465 9.60564 14.1807L8.32258 10.7964H4.45253L5.51786 13.6064H7.60244C7.83952 13.6064 8.03172 13.7967 8.03172 14.0314C8.03172 14.2661 7.83952 14.4564 7.60244 14.4564H5.22046C5.04156 14.4564 4.88141 14.3465 4.81855 14.1807L3.43099 10.5207C3.38151 10.3902 3.39984 10.244 3.48003 10.1294Z"
                fill="currentColor"
            />
            <path
                d="M7.26332 13.7438L10.6628 10.0837L11.2948 10.659L7.89531 14.3191L7.26332 13.7438Z"
                fill="currentColor"
            />
            <path
                d="M9.19569 4.41658C4.90733 4.41658 1.43093 7.85811 1.43093 12.1034C1.43093 16.3488 4.90733 19.7903 9.19569 19.7903C13.484 19.7903 16.9604 16.3488 16.9604 12.1034C16.9604 7.85811 13.484 4.41658 9.19569 4.41658ZM0 12.1034C0 7.07575 4.11705 3 9.19569 3C14.2743 3 18.3914 7.07575 18.3914 12.1034C18.3914 17.1311 14.2743 21.2069 9.19569 21.2069C4.11705 21.2069 0 17.1311 0 12.1034Z"
                fill="currentColor"
            />
            <path
                d="M15.2918 20.5227C15.5557 20.551 15.8235 20.5656 16.0944 20.5656C20.4605 20.5656 24 16.7919 24 12.1369C24 7.48192 20.4605 3.70829 16.0944 3.70829C15.8503 3.70829 15.6089 3.72008 15.3704 3.74315L17.2752 5.2318V5.243C20.2239 5.83855 22.5691 8.62201 22.5691 12.1369C22.5691 15.6911 20.1712 18.4974 17.1762 19.05L15.2918 20.5227Z"
                fill="currentColor"
            />
        </g>
    ),
});

export const StakedBalanceIcon = createIcon({
    displayName: 'StakedBalanceIcon',
    viewBox: '0 0 24 24',
    path: (
        <g>
            <path
                d="M18.3752 12.75C17.5795 12.7495 16.816 13.0652 16.2528 13.6276L13.6279 16.2525C13.0657 16.8151 12.7498 17.5779 12.7498 18.3731C12.7498 19.1683 13.0657 19.9311 13.6279 20.4937L16.2528 23.1187C16.8154 23.6808 17.5782 23.9968 18.3734 23.9968C19.1686 23.9968 19.9314 23.6808 20.494 23.1187L23.119 20.4937C23.6811 19.9311 23.9971 19.1683 23.9971 18.3731C23.9971 17.5779 23.6811 16.8151 23.119 16.2525L20.494 13.6276C19.9319 13.066 19.1699 12.7505 18.3752 12.75V12.75ZM18.3752 21L15.7503 18.3751L18.3752 15.7501L21.0001 18.3751L18.3752 21Z"
                fill="currentColor"
            />
            <path
                d="M3.74998 18H10.5V14.9999H3.74998C3.33564 14.9999 3.00005 14.664 3.00005 14.25V3.74998C3.00005 3.33564 3.33565 3.00005 3.74998 3.00005H17.625C17.8238 3.00005 18.0147 3.07905 18.1552 3.21951C18.2959 3.36024 18.3749 3.55093 18.3749 3.74999V10.1249H21.375V3.74999C21.375 2.75544 20.98 1.80147 20.2766 1.09835C19.5735 0.394955 18.6195 0 17.625 0H3.74999C2.75544 0 1.80147 0.394981 1.09835 1.09835C0.394954 1.80147 0 2.75544 0 3.74999V14.25C0 15.2445 0.394981 16.1982 1.09835 16.9016C1.80147 17.6047 2.75543 18 3.74998 18Z"
                fill="currentColor"
            />
            <path
                d="M8.99985 24.0001H10.5V21H0V24.0001H8.99985Z"
                fill="currentColor"
            />
        </g>
    ),
});

export const AllowanceIcon = createIcon({
    displayName: 'AllowanceIcon',
    viewBox: '0 0 21 21',
    path: (
        <g>
            <path
                d="M10.63 20.3643C12.1674 20.3643 13.6834 20.0032 15.0557 19.3101C16.4281 18.617 17.6185 17.6112 18.531 16.3739C19.4436 15.1366 20.0527 13.7022 20.3095 12.1864C20.5663 10.6705 20.4635 9.11554 20.0093 7.6467C19.3613 8.18381 18.5778 8.53203 17.7449 8.65318C18.1628 10.2188 18.0527 11.8785 17.4315 13.3751C16.8104 14.8717 15.7129 16.1216 14.3092 16.9312C12.9055 17.7407 11.274 18.0646 9.66752 17.8527C8.06104 17.6409 6.5693 16.905 5.42351 15.7592C4.27771 14.6134 3.54185 13.1217 3.32997 11.5152C3.11809 9.90871 3.44202 8.2772 4.25156 6.87351C5.06109 5.46983 6.31103 4.37236 7.80764 3.75121C9.30425 3.13005 10.964 3.0199 12.5295 3.43781C12.6501 2.60513 12.9976 1.8217 13.5338 1.17339C12.1829 0.752262 10.7569 0.628129 9.35352 0.80949C7.95015 0.990852 6.60256 1.47342 5.40307 2.22414C4.20358 2.97486 3.18054 3.97599 2.40403 5.15895C1.62752 6.3419 1.11589 7.67873 0.904196 9.07785C0.692499 10.477 0.785736 11.9053 1.17752 13.265C1.5693 14.6248 2.25037 15.8837 3.17407 16.9557C4.09777 18.0277 5.24227 18.8873 6.52918 19.4758C7.81608 20.0642 9.21496 20.3675 10.63 20.3649V20.3643Z"
                fill="currentColor"
            />
            <path
                d="M10.6307 5.94531C10.3083 5.94497 9.98891 6.00819 9.6909 6.13134C9.39289 6.25449 9.12207 6.43517 8.89392 6.66305L6.74674 8.81078C6.51883 9.03861 6.33803 9.30912 6.21467 9.60684C6.09132 9.90457 6.02783 10.2237 6.02783 10.5459C6.02783 10.8682 6.09132 11.1873 6.21467 11.485C6.33803 11.7828 6.51883 12.0533 6.74674 12.2811L8.89392 14.4288C9.35427 14.8887 9.97837 15.1471 10.6291 15.1471C11.2798 15.1471 11.9039 14.8887 12.3643 14.4288L14.512 12.2811C14.9719 11.8208 15.2302 11.1967 15.2302 10.5459C15.2302 9.89523 14.9719 9.27113 14.512 8.81078L12.3643 6.66305C11.9043 6.20358 11.2808 5.94544 10.6307 5.94531ZM10.6307 12.6953L8.48301 10.5476L10.6307 8.39986L12.7785 10.5476L10.6307 12.6953Z"
                fill="currentColor"
            />
            <path
                d="M14.8896 4.54598L16.0495 5.1262L16.6292 6.28553C16.6699 6.36788 16.7329 6.43718 16.811 6.48564C16.8891 6.5341 16.9791 6.55978 17.071 6.55978C17.1629 6.55978 17.253 6.5341 17.3311 6.48564C17.4091 6.43718 17.4721 6.36788 17.5129 6.28553L18.0931 5.12346L19.253 4.54379C19.3353 4.503 19.4047 4.44002 19.4531 4.36195C19.5016 4.28387 19.5272 4.19381 19.5272 4.10192C19.5272 4.01002 19.5016 3.91996 19.4531 3.84189C19.4047 3.76381 19.3353 3.70083 19.253 3.66004L18.0931 3.08257L17.5129 1.92269C17.4721 1.84034 17.4091 1.77103 17.3311 1.72257C17.253 1.67411 17.1629 1.64844 17.071 1.64844C16.9791 1.64844 16.8891 1.67411 16.811 1.72257C16.7329 1.77103 16.6699 1.84034 16.6292 1.92269L16.0495 3.08257L14.8896 3.66278C14.8073 3.70357 14.738 3.76655 14.6895 3.84463C14.641 3.9227 14.6154 4.01276 14.6154 4.10466C14.6154 4.19655 14.641 4.28661 14.6895 4.36469C14.738 4.44276 14.8073 4.50574 14.8896 4.54653V4.54598Z"
                fill="currentColor"
            />
        </g>
    ),
});

export const WalletIcon = createIcon({
    displayName: 'WalletIcon',
    viewBox: '0 0 22 22',
    path: (
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.22103 1.20895C3.69755 1.01161 4.20827 0.91008 4.72403 0.910156H17.1604V6.14652H20.4331V21.8556H4.72403C4.20827 21.8557 3.69755 21.7542 3.22103 21.5568C2.74452 21.3595 2.31155 21.0702 1.94685 20.7055C1.58216 20.3408 1.29288 19.9078 1.09554 19.4313C0.898206 18.9548 0.796676 18.4441 0.796753 17.9283V4.83743C0.796676 4.32167 0.898206 3.81095 1.09554 3.33444C1.29288 2.85792 1.58216 2.42495 1.94685 2.06026C2.31155 1.69556 2.74452 1.40628 3.22103 1.20895ZM14.5422 3.52834H4.78247C4.44916 3.52079 4.12489 3.63705 3.87231 3.85465C3.61973 4.07226 3.45678 4.37577 3.41494 4.70652C3.39649 4.88913 3.41666 5.07357 3.47415 5.24787C3.53163 5.42217 3.62514 5.58243 3.7486 5.71823C3.87206 5.85403 4.0227 5.96235 4.19075 6.03614C4.3588 6.10992 4.54049 6.14753 4.72403 6.14652H14.5422V3.52834ZM17.8149 19.2374V8.7647H4.72403C4.27778 8.76372 3.835 8.68623 3.41494 8.53561V17.9283C3.41494 18.2755 3.55286 18.6085 3.79836 18.854C4.04386 19.0995 4.37683 19.2374 4.72403 19.2374H17.8149ZM15.6307 14.7278C15.7746 14.5125 15.8513 14.2594 15.8513 14.0005C15.8513 13.6533 15.7134 13.3203 15.4679 13.0748C15.2224 12.8293 14.8894 12.6914 14.5422 12.6914C14.2833 12.6914 14.0302 12.7682 13.815 12.912C13.5997 13.0559 13.4319 13.2603 13.3328 13.4995C13.2337 13.7387 13.2078 14.0019 13.2583 14.2559C13.3088 14.5098 13.4335 14.7431 13.6166 14.9262C13.7997 15.1092 14.0329 15.2339 14.2869 15.2844C14.5408 15.3349 14.804 15.309 15.0432 15.2099C15.2824 15.1109 15.4869 14.9431 15.6307 14.7278Z"
            fill="currentColor"
        />
    ),
});

export const TimerIcon = createIcon({
    displayName: 'WalletIcon',
    viewBox: '0 0 22 22',
    path: (
        <path
            d="M17.618 5.968l1.453-1.453 1.414 1.414-1.453 1.453a9 9 0 1 1-1.414-1.414zM12 20a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM11 8h2v6h-2V8zM8 1h8v2H8V1z"
            fill="currentColor"
        />
    ),
});

export const TimeIcon = createIcon({
    displayName: 'TimeIcon',
    viewBox: '0 0 24 24',
    path: (
        <path
            d="M12.293 22C6.76997 22 2.29297 17.523 2.29297 12C2.29297 6.477 6.76997 2 12.293 2C17.816 2 22.293 6.477 22.293 12C22.293 17.523 17.816 22 12.293 22ZM13.293 12V7H11.293V14H17.293V12H13.293Z"
            fill="currentColor"
        />
    ),
});
