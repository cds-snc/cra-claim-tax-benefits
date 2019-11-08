const testxml = {
  "declaration": {
    "attributes": {
      "version": "1.0",
      "encoding": "UTF-8"
    }
  },
  "elements": [
    {
      "type": "element",
      "name": "net:Netfile",
      "attributes": {
        "xmlns:ccms": "http://www.cra-arc.gc.ca/xmlns/ccms/1-1-0",
        "xmlns:comm": "http://www.cra-arc.gc.ca/xmlns/comm/2019/1-0-0",
        "xmlns:net": "http://www.cra-arc.gc.ca/xmlns/netfile/2019/1-0-0",
        "xmlns:sdt": "http://www.cra-arc.gc.ca/xmlns/sdt/2-2-0",
        "xmlns:sfd": "http://www.cra-arc.gc.ca/xmlns/sfd/2019/1-0-0",
        "xmlns:surv": "http://www.cra-arc.gc.ca/xmlns/surv/1-0-0",
        "xmlns:t1": "http://www.cra-arc.gc.ca/xmlns/t1/2019/1-0-0",
        "xmlns:t1135": "http://www.cra-arc.gc.ca/xmlns/t1135/2019/1-0-0",
        "xmlns:tp": "http://www.cra-arc.gc.ca/xmlns/tp/2019/1-0-0",
        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "xsi:schemaLocation": "http://www.cra-arc.gc.ca/xmlns/netfile/2019/1-0-0 netfile.xsd"
      },
      "elements": [
        {
          "type": "element",
          "name": "net:T1Netfile",
          "elements": [
            {
              "type": "element",
              "name": "t1:T1Return",
              "elements": [
                {
                  "type": "element",
                  "name": "comm:SoftwareID",
                  "elements": [
                    {
                      "type": "text",
                      "text": "024G"
                    }
                  ]
                },
                {
                  "type": "element",
                  "name": "comm:SoftwareRevisionDate",
                  "elements": [
                    {
                      "type": "text",
                      "text": "2019-02-22"
                    }
                  ]
                },
                {
                  "type": "element",
                  "name": "t1:RelatedProgramData",
                  "elements": [
                    {
                      "type": "element",
                      "name": "t1:CanadianCitizenshipIndicator",
                      "elements": [
                        {
                          "type": "text",
                          "text": "1"
                        }
                      ]
                    }
                  ]
                },
              ]
            }
          ]
        }
      ]
    }
  ]
}

module.exports = {
  testxml,
}