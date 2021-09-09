// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { FC, useState } from 'react';
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Textarea,
} from '@chakra-ui/react';
import createPersistedState from 'use-persisted-state';

const TermsCondition: FC = () => {
    // persistent state of user read disclaimer message, stored in browser localStorage
    const useDisclaimerState = createPersistedState('tc');
    const [accepted, setAccepted] = useDisclaimerState(false);

    // control if user scrolled to bottom of text
    const [scrolled, setScrolled] = useState(false);

    const handleScroll = (e: any) => {
        const bottom =
            e.target.scrollHeight - e.target.scrollTop ===
            e.target.clientHeight;
        setScrolled(bottom || scrolled);
    };

    return (
        <Modal
            isOpen={!accepted}
            onClose={() => setAccepted(true)}
            closeOnOverlayClick={false}
            closeOnEsc={false}
            size="4xl"
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Terms and Conditions</ModalHeader>
                <ModalBody>
                    <Textarea h="60vh" onScroll={handleScroll}>
                        Cartesi’s Website is offered by Cartesi Pte. Ltd. The
                        “Services” refers to any services that we and/or our
                        affiliates may make available to you including any
                        services we may provide through our website at the
                        www.cartesi.io, https://explorer.cartesi.io or any
                        associated websites (collectively, the “Site”), any
                        mobile or decentralized applications (collectively, the
                        “Apps”), any application programming interface (“API”),
                        or through any other means. 1. Agreement to Terms. By
                        using our Services, you agree to be bound by these Terms
                        of Service and any other terms that are incorporated by
                        reference in the Terms of Service, any other agreements
                        we present to you, and any other terms as part of any
                        future functionality as related to the Services (unless
                        otherwise stated in such terms) (collectively, “Terms”).
                        Please review these Terms carefully. If you don’t agree
                        to be bound by these Terms, do not use the Services. If
                        you violate any of these Terms, you may lose your right
                        to use any Services. For the purposes of these Terms:
                        “Cartesi,” "us," "our," or "we" refers to Cartesi Pte.
                        Ltd. and/or our affiliates; “You” and “your” refers to
                        anybody who accesses or uses, in any way, the Services
                        (as defined below); and If you are accessing or using
                        and accessing the Services on behalf of a company (such
                        as your employer) or other legal entity, you represent
                        and warrant that you have the authority to bind that
                        entity to these Terms and, in that case, “you” and
                        “your” will refer to that entity. READ THESE TERMS
                        CAREFULLY BEFORE USING OR ACCESSING THE SERVICES. YOU
                        CANNOT USE OR ACCESS THE SERVICES IF YOU DO NOT ACCEPT
                        THESE TERMS. IMPORTANT NOTICE REGARDING ARBITRATION FOR
                        U.S. CUSTOMERS: WHEN YOU AGREE TO THESE TERMS YOU ARE
                        AGREEING (WITH LIMITED EXCEPTION) TO RESOLVE ANY DISPUTE
                        BETWEEN YOU AND Cartesi THROUGH BINDING, INDIVIDUAL
                        ARBITRATION RATHER THAN IN COURT. PLEASE REVIEW
                        CAREFULLY SECTION 17 “DISPUTE RESOLUTION AND
                        ARBITRATION; CLASS ACTION WAIVER” BELOW FOR DETAILS
                        REGARDING ARBITRATION. 2. Changes to Terms or Services.
                        We may update the Terms at any time, at our sole
                        discretion. If we do so, we’ll deliver a notice either
                        by posting the updated Terms on the Website or through
                        other communications. It’s important that you review the
                        Terms whenever we update them before you use the
                        Services. If you continue to use the Services after we
                        have posted updated Terms, you are agreeing to be bound
                        by the updated Terms. If you don’t agree to be bound by
                        the updated Terms, then you may not use the Services
                        anymore. Because our Services are evolving over time we
                        may change or discontinue all or any part of the
                        Services, at any time and without notice, at our sole
                        discretion. Continued access and use of the Services
                        following notice of any such modifications indicates You
                        acknowledge and agree to be bound by the modifications.
                        3. Eligibility. You may use the Services only if you are
                        at least 13 years of age (or such other minimum age at
                        which you can provide consent to data processing under
                        the laws of your territory), and not otherwise barred
                        from using and accessing the Services under applicable
                        law. If you are not yet 18 years old, you must have the
                        permission of an adult to access and use the Services
                        and agree to these Terms, and that adult must be a
                        parent or legal guardian who is willing to be
                        responsible for your use of the Services. In addition,
                        you represent to us that you and your financial
                        institutions, or any party that owns or controls you or
                        your financial institutions, are (1) not subject to
                        sanctions or otherwise designated on any list of
                        prohibited or restricted parties, including but not
                        limited to the lists maintained by the United Nations
                        Security Council, the U.S. Government (e.g., the
                        Specially Designated Nationals List and Foreign
                        Sanctions Evaders List of the U.S. Department of
                        Treasury and the Entity List of the U.S. Department of
                        Commerce), the European Union or its Member States, or
                        other applicable government authority and (2) not
                        located in any country to which the United States has
                        embargoed goods or has otherwise applied any sanctions.
                        5. Services and Integrating an Electronic Wallet. You
                        will not be able to engage in certain parts of the
                        Services other than through MetaMask or another
                        Ethereum-compatible browser extension. The Services will
                        only recognize you as a user, and you will only be able
                        to fully engage with the Services if your Third-Party
                        Wallet is connected and unlocked, or otherwise linked to
                        the Services. GENERAL. YOU ARE SOLELY RESPONSIBLE FOR
                        MAINTAINING THE SECURITY OF YOUR ACCOUNT, ANY ASSOCIATED
                        CREDENTIALS INCLUDING YOUR ELECTRONIC WALLET ACCOUNT.
                        FAILURE TO DO SO MAY RESULT IN THE LOSS OF CONTROL OF
                        ANY CTSI OR OTHER ASSETS ASSOCIATED WITH YOUR ACCOUNT.
                        You are responsible for implementing all appropriate
                        measures for securing your Account, including any
                        credentials or and any other data that can be used to
                        access the electronic wallet or Account. You acknowledge
                        and agree that you are solely responsible for evaluating
                        and adopting security procedures to secure and recover
                        your Account and any CTSI associated therewith. As such,
                        you agree that we shall not be liable for any failure of
                        any security procedures or any other acts or omissions
                        which may result in your loss of access to your Account
                        or associated CTSI. Cartesi does not receive or store
                        your electronic wallet or Account credentials
                        (collectively, your “Credentials”). Therefore, we cannot
                        assist you with the retrieval of such Credentials if you
                        lose them. You are solely responsible for remembering
                        your Credentials. If you have not safely stored a backup
                        of any Credentials, you accept and acknowledge that any
                        CTSI you have associated with your Account will become
                        inaccessible if you do not remember your Credentials. 6.
                        Our Rights. All title, ownership, and intellectual
                        property rights in and to the Services are owned by
                        Cartesi or its licensors, unless otherwise stated. You
                        acknowledge and agree that the Services contain
                        proprietary rights that are protected by applicable
                        intellectual property and other laws. Except as
                        expressly authorized by us, you agree not to copy,
                        modify, rent, lease, loan, sell, distribute, perform,
                        display or create derivative works based on the
                        Services, in whole or in part. 7. Rights and Terms for
                        Services. If you comply with these Terms, Cartesi grants
                        to you a limited non-exclusive, non-transferable
                        license, with no right to sublicense, to download and
                        install the Services on your personal computers, mobile
                        handsets, tablets, wearable devices, and/or other
                        devices and to run the Services solely for your own
                        personal non-commercial purposes. Except as expressly
                        permitted in these Terms, you may not: (i) copy, modify
                        or create derivative works based on the Services; (ii)
                        distribute, transfer, sublicense, lease, lend or rent
                        the Services to any third party; (iii) reverse engineer,
                        decompile or disassemble the Services (unless applicable
                        law permits, despite this limitation); or (iv) make the
                        functionality of the Services available to multiple
                        users through any means. 10. General Prohibitions and
                        Company’s Enforcement Rights. Tamper with or hack the
                        Services, Cartesi computer systems, or the technical
                        delivery systems of Cartesi network; Interfere with, or
                        attempt to interfere with, the access of any user, host
                        or network, including, without limitation, sending a
                        virus, overloading, flooding, spamming, or mail-bombing
                        the Services or Cartesi network; Impersonate or
                        misrepresent your affiliation with any person or entity;
                        Avoid, bypass, remove, deactivate, impair, descramble or
                        otherwise circumvent any technological measure designed
                        or intended to secure or protect any video content
                        stored, processed, streamed, or distributed through
                        Cartesi network; Access, copy, distribute, or publish
                        any video content included in any video workloads
                        processed through Cartesi network; Forge, counterfeit,
                        or attempt to use any fake, counterfeit, or unauthorized
                        CTSI or other tokens to access or participate in the
                        Services, or use any methods to generate or obtain
                        disbursements other than the authorized methods as
                        described in the Services; Adversely affect the goodwill
                        of the Services or Cartesi network; Violate any
                        applicable law or regulation; or Encourage or enable any
                        other individual to do any of the foregoing. Although we
                        are not obligated to monitor access to or participation
                        in the Services, we have the right to do so for the
                        purpose of operating the Services, to ensure compliance
                        with these Terms, and to comply with applicable law or
                        other legal requirements. We reserve the right but are
                        not obligated, to suspend or terminate the Services at
                        any time and without notice. We have the right to
                        investigate violations of these Terms or conduct that
                        affects the Services. We may also consult and cooperate
                        with law enforcement authorities to prosecute users who
                        violate the law. 11. Links to Third Party Websites or
                        Resources. The Services may contain links to third-party
                        websites or resources. Such links are provided only as a
                        convenience and we are not responsible for the content,
                        products, or services on or available from those
                        websites or resources or links displayed on such
                        websites. You acknowledge sole responsibility for and
                        assume all risk arising from your use of any third-party
                        websites or resources. 12. Termination. We may terminate
                        your access to and use of the Services, at our sole
                        discretion, at any time and without notice to you. You
                        may terminate your use of the Services by withdrawing
                        your CTSI Tokens at any time. Upon any termination,
                        discontinuation or cancellation of the Services, the
                        following Sections will survive 5, 6, 7, 8, 9, 10, 13,
                        14, 15, 16, and 17. 13. Warranty Disclaimers. THE
                        SERVICES ARE PROVIDED “AS IS,” WITHOUT WARRANTY OF ANY
                        KIND. WITHOUT LIMITING THE FOREGOING, WE EXPLICITLY
                        DISCLAIM ANY IMPLIED WARRANTIES OF MERCHANTABILITY,
                        FITNESS FOR A PARTICULAR PURPOSE, QUIET ENJOYMENT AND
                        NON-INFRINGEMENT, AND ANY WARRANTIES ARISING OUT OF
                        COURSE OF DEALING OR USAGE OF TRADE. We make no warranty
                        that the Services will meet your requirements or be
                        available on an uninterrupted, secure, or error-free
                        basis. We make no warranty regarding the quality,
                        accuracy, timeliness, truthfulness, completeness, or
                        reliability of the Services or Cartesi network. You
                        acknowledge and agree that you participate in the
                        Services at your own risk and expense and that we make
                        no guarantee or representation that you will receive any
                        compensation or disbursements as a result of your
                        participation. YOU ACCEPT AND ACKNOWLEDGE THAT THERE ARE
                        RISKS ASSOCIATED WITH PARTICIPATING IN THE SERVICES
                        INCLUDING, BUT NOT LIMITED TO, THE RISK OF FAILURE OF
                        HARDWARE, SOFTWARE AND INTERNET CONNECTIONS, THE RISK OF
                        MALICIOUS SOFTWARE INTRODUCTION, LOSS OF THE CTSI
                        TOKENS, AND THE RISK THAT THIRD PARTIES MAY OBTAIN
                        UNAUTHORIZED ACCESS TO INFORMATION STORED WITHIN YOUR
                        ACCOUNT OR ON CARTESI NETWORK. YOU ACCEPT AND
                        ACKNOWLEDGE THAT WE WILL NOT BE RESPONSIBLE FOR ANY
                        LOSSES, FAILURES, DISRUPTIONS, ERRORS, DISTORTIONS, OR
                        DELAYS YOU MAY EXPERIENCE WHEN PARTICIPATING IN THE
                        SERVICES, INCLUDING ANY LOSS OF CTSI TOKENS OR FUNDS,
                        HOWEVER, CAUSED. YOU ACCEPT AND ACKNOWLEDGE THAT THIRD
                        PARTIES MAY GAIN UNAUTHORIZED ACCESS TO API KEYS
                        PROVIDED TO YOU AS PART OF THE SERVICES. YOU ACCEPT AND
                        ACKNOWLEDGE THAT WE WILL NOT BE RESPONSIBLE FOR ANY
                        LOSSES, FAILURES, DISRUPTIONS, ERRORS, DISTORTIONS, OR
                        DELAYS YOU MAY EXPERIENCE WHEN PARTICIPATING IN THE
                        SERVICES, INCLUDING ANY LOSS OF CTSI TOKENS OR FUNDS,
                        CAUSED BY SUCH UNAUTHORIZED ACCESS. YOU ACCEPT AND
                        ACKNOWLEDGE THAT YOU WILL BE RESPONSIBLE FOR ANY CTSI
                        QUERY FEES OWED AS A RESULT OF SUCH UNAUTHORIZED ACCESS.
                        YOU ACCEPT AND ACKNOWLEDGE THAT THERE ARE RISKS
                        ASSOCIATED WITH UTILIZING THE CARTESI NETWORK,
                        INCLUDING, BUT NOT LIMITED TO, THE RISK OF UNKNOWN
                        VULNERABILITIES IN OR UNANTICIPATED CHANGES TO THE
                        CARTESI NETWORK PROTOCOL. YOU ACKNOWLEDGE AND ACCEPT
                        THAT WE HAVE NO CONTROL OVER ANY CRYPTOGRAPHIC TOKENS,
                        INCLUDING CTSI, UTILIZED ON THE CARTESI NETWORK AND THAT
                        WE WILL NOT BE RESPONSIBLE FOR ANY HARM OR LOSS
                        OCCURRING AS A RESULT OF SUCH RISKS. You have a
                        sufficient understanding of the functionality, usage,
                        storage, transmission mechanisms, and other material
                        characteristics of cryptographic tokens, token storage
                        mechanisms (such as token wallets), distributed ledger
                        technology, and decentralized software systems to
                        understand the terms of the Services and to appreciate
                        the risks and implications relating to the Services and
                        the CTSI Tokens. YOU ARE SOLELY RESPONSIBLE FOR THE
                        PROPER CREATION, STORAGE, BACKUP, TRANSFER, AND OTHER
                        USE OF YOUR CARTESI ACCOUNT. WHEN TRANSFERRING CTSI
                        TOKENS, PLEASE VERIFY THE ADDRESS YOU HAVE SPECIFIED FOR
                        ACCURACY AND ENSURE THAT THERE ARE NO TYPOS, ERRORS, OR
                        INACCURACIES. YOU ASSUME FULL RESPONSIBILITY AND
                        LIABILITY FOR ANY LOSSES FROM ANY INTENTIONAL OR
                        UNINTENTIONAL MISUSE OF YOUR CARTESI ACCOUNT, INCLUDING
                        ANY LOSS RESULTING FROM DESIGNATING A NON-CTSI COMPLIANT
                        WALLET FOR THE RECEIPT OF TOKENS, DEPOSITING OR STAKING
                        CTSI TOKENS TO A NON-CTSI COMPLIANT WALLET OR
                        NON-EXISTENT WALLET, ERRORS OR TYPOS IN ANY WALLET
                        ADDRESSES THAT YOU PROVIDE TO ANYONE, OR FAILURES TO
                        PROPERLY FUND CARTESI’S BILLING SMART CONTRACT SO THAT
                        YOUR API KEY SUPPORTS QUERIES. WE WILL NOT BE LIABLE TO
                        YOU FOR ANY LOSSES ARISING OUT OF OR IN CONNECTION WITH
                        (I) ACTS OR OMISSIONS BY YOU, (II) SOFTWARE BUGS,
                        ERRORS, OR DOWNTIME IN CARTESI NETWORK OR THE BLOCKCHAIN
                        NETWORK UNDERLYING THE CTSI TOKEN, (III) FORKS TO
                        CARTESI NETWORK OR THE CTSI TOKEN, OR (IV) HACKS OR
                        CYBERSECURITY BREACHES BY A THIRD PARTY. THERE IS NO
                        ASSURANCE THAT ANY OF THE SERVICES WILL FUNCTION OR
                        OPERATE AS EXPECTED. IN ADDITION, YOUR CTSI TOKENS MAY
                        BE SUBJECT TO LOSS, INCLUDING A TOTAL LOSS, DUE TO
                        SOFTWARE BUGS, ERRORS, TECHNICAL DIFFICULTIES, OR OTHER
                        ACTIONS OR OMISSIONS OF THIRD PARTIES, YOUR TOKEN WALLET
                        SOFTWARE, OR THE UNDERLYING BLOCKCHAIN NETWORK. WE WILL
                        NOT BE RESPONSIBLE OR LIABLE TO YOU FOR ANY LOSS AND
                        TAKE NO RESPONSIBILITY FOR AND WILL NOT BE LIABLE TO YOU
                        FOR YOUR PARTICIPATION IN THE SERVICES, INCLUDING BUT
                        NOT LIMITED TO ANY LOSSES, DAMAGES, OR CLAIMS ARISING
                        FROM: (A) USER ERROR SUCH AS FORGOTTEN PASSWORDS, LOST
                        OR MISSING PRIVATE KEYS, INCORRECTLY CONSTRUCTED
                        TRANSACTIONS, OR MISTYPED ADDRESSES; (B) SERVER FAILURE;
                        (C) CORRUPTED WALLET FILES; (D) UNAUTHORIZED ACCESS TO
                        APPLICATIONS; OR (E) ANY UNAUTHORIZED THIRD-PARTY
                        ACTIVITIES, INCLUDING WITHOUT LIMITATION THE USE OF
                        VIRUSES, PHISHING, BRUTE-FORCING OR OTHER MEANS OF
                        ATTACK AGAINST THE SERVICES OR CARTESI NETWORK. WE MAKE
                        NO WARRANTY THAT THE SERVICES, INCLUDING THE SERVERS
                        THAT MAKE THE SERVICES AVAILABLE, ARE FREE OF VIRUSES OR
                        ERRORS, THAT CARTESI NETWORK WILL BE UNINTERRUPTED, OR
                        THAT THE DEFECTS WILL BE CORRECTED. WE WILL NOT BE
                        RESPONSIBLE OR LIABLE TO YOU FOR ANY LOSS OF ANY KIND,
                        FROM ACTION TAKEN, OR TAKEN IN RELIANCE ON MATERIAL, OR
                        INFORMATION, CONTAINED OR MADE AVAILABLE THROUGH THE
                        SERVICES. 14. Indemnity. You will defend, indemnify and
                        hold harmless us and our officers, directors, employees,
                        and agents from and against any claims, disputes,
                        demands, liabilities, damages, losses, and costs and
                        expenses, including, without limitation, reasonable
                        legal and accounting fees arising out of or in any way
                        connected with your violation of these Terms. 15.
                        Limitation of Liability. You will defend, indemnify and
                        hold harmless us and our officers, directors, employees,
                        and agents from and against any claims, disputes,
                        demands, liabilities, damages, losses, and costs and
                        expenses, including, without limitation, reasonable
                        legal and accounting fees arising out of or in any way
                        connected with your violation of these Terms. NEITHER WE
                        NOR ANY OTHER PARTY INVOLVED IN CREATING, PRODUCING, OR
                        DELIVERING THE SERVICES WILL BE LIABLE FOR ANY
                        INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
                        DAMAGES, OR DAMAGES FOR LOST PROFITS, LOST REVENUES,
                        LOST SAVINGS, LOST BUSINESS OPPORTUNITY, LOSS OF DATA OR
                        GOODWILL, SERVICE INTERRUPTION, COMPUTER DAMAGE OR
                        SYSTEM FAILURE OR THE COST OF SUBSTITUTE SERVICES OF ANY
                        KIND ARISING OUT OF OR IN CONNECTION WITH THESE TERMS OR
                        FROM THE USE OF OR INABILITY TO USE THE SERVICES,
                        WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING
                        NEGLIGENCE), PRODUCT LIABILITY OR ANY OTHER LEGAL
                        THEORY, AND WHETHER OR NOT WE OR ANY OTHER PARTY HAS
                        BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE, EVEN IF
                        A LIMITED REMEDY SET FORTH HEREIN IS FOUND TO HAVE
                        FAILED OF ITS ESSENTIAL PURPOSE. SOME JURISDICTIONS DO
                        NOT ALLOW THE EXCLUSION OR LIMITATION OF LIABILITY FOR
                        CONSEQUENTIAL OR INCIDENTAL DAMAGES, SO THE ABOVE
                        LIMITATION MAY NOT APPLY TO YOU. IN NO EVENT WILL OUR
                        TOTAL LIABILITY ARISING OUT OF OR IN CONNECTION WITH
                        THESE TERMS OR FROM THE USE OF OR INABILITY TO USE OR
                        PARTICIPATE IN THE SERVICES EXCEED ONE THOUSAND DOLLARS
                        ($1,000). THE EXCLUSIONS AND LIMITATIONS OF DAMAGES SET
                        FORTH ABOVE ARE FUNDAMENTAL ELEMENTS OF THE BASIS OF THE
                        BARGAIN BETWEEN US AND YOU. 16. Governing Law and Forum
                        Choice. These Terms and any action related thereto will
                        be governed by the laws of the Cayman Islands, unless
                        otherwise, without regard to its conflict of laws
                        provisions. Except as otherwise expressly set forth in
                        Section 18 “Dispute Resolution,” the exclusive
                        jurisdiction for all Disputes (as defined below) will be
                        the courts located in the Cayman Islands, and you and
                        Cartesi each waive any objection to jurisdiction and
                        venue in such courts. 17. Dispute Resolution and
                        Arbitration; Class Action Waiver. (a) Mandatory
                        Arbitration of Disputes. We each agree that any dispute,
                        claim or controversy arising out of or relating to these
                        Terms or the breach, termination, enforcement,
                        interpretation or validity thereof or the use of the
                        Services (collectively, "Disputes") will be resolved
                        solely by binding, individual arbitration and not in a
                        class, representative or consolidated action or
                        proceeding. You and we agree that the JAMS International
                        Arbitration Rules govern the interpretation and
                        enforcement of these Terms, and that you and we are each
                        waiving the right to a trial by jury or to participate
                        in a class action. This arbitration provision shall
                        survive termination of these Terms. (b) Exceptions. As
                        limited exceptions to listed in Section 17(a) above: (i)
                        we both may seek to resolve a Dispute in small claims
                        court if it qualifies; and (ii) we each retain the right
                        to seek injunctive or other equitable relief from a
                        court to prevent (or enjoin) the infringement or
                        misappropriation of our intellectual property rights.
                        (c) Conducting Arbitration and Arbitration Rules. The
                        arbitration will be conducted by the JAMS (“JAMS”) under
                        its International Arbitration Rules (the “JAMS Rules”)
                        then in effect, except as modified by these Terms. The
                        JAMS Rules are available at www.jamsadr.com or by
                        calling 1-800-352-JAMS. A party who wishes to start
                        arbitration must submit a written Demand for Arbitration
                        to JAMS and give notice to the other party as specified
                        in the JAMS Rules. JAMS provides a form Demand for
                        Arbitration at www.jamsadr.com. Any arbitration hearings
                        will take place in the county (or parish) where you
                        live, unless we both agree to a different location. The
                        parties agree that the arbitrator shall have exclusive
                        authority to decide all issues relating to the
                        interpretation, applicability, enforceability and scope
                        of this arbitration agreement. (d) Arbitration Costs.
                        Payment of all filing, administration and arbitrator
                        fees will be governed by the JAMS Rules, and we won’t
                        seek to recover the administration and arbitrator fees
                        we are responsible for paying, unless the arbitrator
                        finds your Dispute frivolous. If we prevail in
                        arbitration we’ll pay all of our attorneys’ fees and
                        costs and won’t seek to recover them from you. If you
                        prevail in arbitration you will be entitled to an award
                        of attorneys’ fees and expenses to the extent provided
                        under applicable law. (e) Injunctive and Declaratory
                        Relief. Except as provided in Section 18(b) above, the
                        arbitrator shall determine all issues of liability on
                        the merits of any claim asserted by either party and may
                        award declaratory or injunctive relief only in favor of
                        the individual party seeking relief and only to the
                        extent necessary to provide relief warranted by that
                        party’s individual claim. To the extent that you or we
                        prevail on a claim and seek public injunctive relief
                        (that is, injunctive relief that has the primary purpose
                        and effect of prohibiting unlawful acts that threaten
                        future injury to the public), the entitlement to and
                        extent of such relief must be litigated in a civil court
                        of competent jurisdiction and not in arbitration. The
                        parties agree that litigation of any issues of public
                        injunctive relief shall be stayed pending the outcome of
                        the merits of any individual claims in arbitration. (f)
                        Class Action Waiver. YOU AND CARTESI AGREE THAT EACH MAY
                        BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS
                        INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS
                        MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE
                        PROCEEDING. Further, if the parties’ Dispute is resolved
                        through arbitration, the arbitrator may not consolidate
                        another person’s claims with your claims and may not
                        otherwise preside over any form of a representative or
                        class proceeding. If this specific provision is found to
                        be unenforceable, then the entirety of this Dispute
                        Resolution section shall be null and void. (g)
                        Severability. With the exception of any of the
                        provisions in Section 18(f) of these Terms (“Class
                        Action Waiver”), if an arbitrator or court of competent
                        jurisdiction decides that any part of these Terms is
                        invalid or unenforceable, the other parts of these Terms
                        will still apply. 18. Severability. If any clause within
                        this Provision (other than the Dispute Resolution and
                        Class Action Waiver clause above) is found to be illegal
                        or unenforceable, that clause will be severed from this
                        Provision whose remainder will be given full force and
                        effect. If the Class Action Waiver clause is found to be
                        illegal or unenforceable, this entire Provision will be
                        unenforceable and the dispute will be decided by a
                        court. 19. General. (a) Reservation of Rights. Cartesi
                        and its licensors exclusively own all right, titles, and
                        interests in and to the Services, including all
                        associated intellectual property rights. You acknowledge
                        that the Services are protected by copyright, trademark,
                        and other laws of the United States and foreign
                        countries. You agree not to remove, alter or obscure any
                        copyright, trademark, service mark, or other proprietary
                        rights notices incorporated in or accompanying the
                        Services. (b) Entire Agreement. These Terms may be
                        superseded by expressly designated legal notices or
                        terms provided through the Services. These expressly
                        designated legal notices or terms are incorporated into
                        these Terms and supersede the provision(s) of these
                        Terms that are designated as being superseded. Unless
                        otherwise stated, these Terms constitute the entire and
                        exclusive understanding and agreement between us and you
                        regarding the Services, and these Terms supersede and
                        replace all prior oral or written understandings or
                        agreements between us and you regarding the Services. If
                        any provision of these Terms is held invalid or
                        unenforceable by an arbitrator or a court of competent
                        jurisdiction, that provision will be enforced to the
                        maximum extent permissible and the other provisions of
                        these Terms will remain in full force and effect. You
                        may not assign or transfer these Terms, by operation of
                        law or otherwise, without our prior written consent. Any
                        attempt by you to assign or transfer these Terms,
                        without such consent, will be null. We may freely assign
                        or transfer these Terms without restriction. Subject to
                        the foregoing, these Terms will bind and inure to the
                        benefit of the parties, their successors, and permitted
                        assigns. (c) Notices. Any notices or other
                        communications provided by us under these Terms will be
                        given: (i) via email; or (ii) by posting to the
                        Services. For notices made by email, the date of receipt
                        will be deemed the date on which such notice is
                        transmitted. (d) Waiver of Rights. Our failure to
                        enforce any right or provision of these Terms will not
                        be considered a waiver of such right or provision. The
                        waiver of any such right or provision will be effective
                        only if in writing and signed by a duly authorized
                        representative of Cartesi. Except as expressly set forth
                        in these Terms, the exercise by either party of any of
                        its remedies under these Terms will be without prejudice
                        to its other remedies under these Terms or otherwise.
                        Contact us If you have any questions about these Terms
                        or otherwise need to contact us for any reason, you can
                        reach us at info@cartesi.io.
                    </Textarea>
                </ModalBody>

                <ModalFooter>
                    <Button
                        colorScheme="blue"
                        isDisabled={!scrolled}
                        mr={3}
                        onClick={() => setAccepted(true)}
                    >
                        Accept
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default TermsCondition;
